<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_WORKFLOW_VIEW']"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_WORKFLOW_VIEW']"
        plain
        class="filter-item"
        size="mini"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        v-if="listQuery.showClear"
        v-permission="['ROLE_WORKFLOW_VIEW']"
        plain
        class="filter-item"
        size="mini"
        style="margin-left: 10px"
        type="info"
        icon="el-icon-minus"
        @click="handleClearQuery"
      >
        Clear
      </el-button>
      <el-button
        v-permission="['ROLE_WORKFLOW_SAVE']"
        plain
        class="filter-item"
        size="mini"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        Add
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      v-permission="['ROLE_WORKFLOW_VIEW_ALL']"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | statusFilter">{{ scope.row.active }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="left" width="80rem">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Workflow Name" align="left">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Workflow Action" align="left">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.workflowType.displayName }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Steps" align="left" width="80rem">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.steps.length }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Action" align="center" prop="action" width="260rem">
        <template slot-scope="scope">
          <el-tooltip content="Show" placement="top">
            <el-button
              :id="scope.row.id"
              v-permission="['ROLE_WORKFLOW_VIEW']"
              plain
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="showView(scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip content="Edit" placement="top">
            <el-button
              :id="scope.row.id"
              v-permission="['ROLE_WORKFLOW_VIEW']"
              plain
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="showEdit(scope.row.id)"
            />
          </el-tooltip>

          <el-tooltip content="Duplicate" placement="top">
            <el-button
              :id="scope.row.id"
              v-permission="['ROLE_WORKFLOW_SAVE']"
              plain
              size="mini"
              type="warning"
              icon="el-icon-document-copy"
              @click="handleDuplicate(scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.active" content="Deactivate" placement="top">
            <el-button
              v-permission="['ROLE_WORKFLOW_ACTIVATE_DEACTIVATE']"
              plain
              size="mini"
              type="danger"
              icon="el-icon-video-pause"
              @click="toggleActivation(scope.row.id, scope.row.active)"
            />
          </el-tooltip>

          <el-tooltip v-else-if="! scope.row.active" content="Activate" placement="top">
            <el-button
              v-permission="['ROLE_WORKFLOW_ACTIVATE_DEACTIVATE']"
              plain
              size="mini"
              type="success"
              icon="el-icon-video-play"
              @click="toggleActivation(scope.row.id, scope.row.active)"
            />
          </el-tooltip>

        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-permission="['ROLE_WORKFLOW_VIEW']"
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

  </div>
</template>

<script>
import { activationWorkflow, getWorkflows } from '@/api/configurations'
import { encodeHashId } from '@/utils'
import { Message } from 'element-ui'
import pagination from '@/components/Pagination'

export default {
  name: 'Index',
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  components: { pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        status: undefined,
        sort: '+id',
        showClear: false
      },
      // Pagination
      page: {
        // size: 1,
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // --end pagination
      title: 'Add Licence Category',
      list: [],
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showWorkflow: false,
      showWorkflowDialog: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    IndexNumber(scope) {
      return this.page.number !== 0 ? Math.abs((this.page.number - 1) * this.page.size + scope.$index + 1) : (scope.$index + 1)
    },
    getNextData() {
      if (this.page.number > 0) {
        this.page.number = this.page.number - 1
      }
      this.fetchData()
      this.page.number += 1
    },
    filterPageData(pageResponse) {
      if (this.newPage) {
        const temp = this.page.size
        this.page = pageResponse
        this.page.size = temp
        this.newPage = false
      } else {
        this.page.totalElements = pageResponse.totalElements
        // this.page.size = pageResponse.size
        this.page.number = pageResponse.number += 1
      }
    },
    fetchData() {
      this.listLoading = true
      getWorkflows(this.page.number, this.page.size, this.listQuery.title)
        .then(response => {
          this.listLoading = false
          if (response.data) {
            this.list = response.data.content
            this.filterPageData(response.data.page)
          } else {
            this.$message({
              message: 'No data found',
              showClose: true,
              type: 'info'
            })
          }
        })
      // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.listLoading = false
        })
    },
    handleEdit(data) {

    },
    showView(id) {
      const encodedId = encodeHashId(id)
      this.$router.push({ name: 'Workflow.Show', params: { Id: encodedId }})
    },
    showEdit(id) {
      const encodedId = encodeHashId(id)
      this.$router.push({ name: 'Workflow.Edit', params: { Id: encodedId }})
    },
    toggleActivation(id, currentState) {
      // send the opposite state to the payload
      const message = currentState ? 'Deactivate' : 'Activate'
      if (window.confirm('Are you sure, you want to ' + message + '?')) {
        this.listLoading = true
        activationWorkflow(id).then(_ => {
          this.listLoading = false
          Message({
            message: 'Successfully ' + message,
            type: 'info',
            duration: 5 * 1000,
            showClose: true
          })
          this.fetchData()
        }).catch(_ => {
          this.listLoading = false
        })
      }
    },
    handleDownload() {
      console.log('handle download')
    },
    handleDuplicate(id) {
      // get the id
      // pass it to create
      const encodedId = encodeHashId(id)
      this.$router.push({ name: 'Workflow.Create', query: { duplicateId: encodedId }})
    },
    handleModifyStatus(data) {
      console.log('handle modify status')
    },
    handleCreate() {
      this.$router.push({ name: 'Workflow.Create' })
    },
    handleFilter() {
      this.listQuery.showClear = true
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
    },
    handleClearQuery() {
      this.listQuery.showClear = false
      this.listQuery.title = ''
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
    }

  }
}
</script>

<style scoped>

</style>
