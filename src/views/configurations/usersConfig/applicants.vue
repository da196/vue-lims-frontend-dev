<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, code"
        style="width: 20rem"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Full name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }}   {{ scope.row.middleName }}   {{ scope.row.lastName }} </span>
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status === true ? 'Active' : 'Inactive' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            :loading="viewRolesLoading"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>

          <el-button
            plain
            size="mini"
            type="primary"
            :loading="editRolesLoading"
            @click="handleView(scope.row)"
          >
            View Profile
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <el-dialog :visible.sync="showRolesDialog" :title="title" width="75%">
      <el-row>
        <div class="el-descriptions">
          <div class="el-descriptions__body">
            <table class="">
              <tbody>
                <tr>
                  <td colspan="2">
                    <span class="el-descriptions__label">Name:</span>
                    <span class="el-descriptions__content">{{ userRoles.firstname }}  {{ userRoles.middlename }} {{ userRoles.lastname }} </span>
                  </td>
                  <td colspan="2">
                    <span class="el-descriptions__label">Phone Number:</span>
                    <span class="el-descriptions__content">{{ userRoles.phone ? userRoles.phone : 'N/A' }}</span>
                  </td>
                  <td colspan="2">
                    <span class="el-descriptions__label">Email:</span>
                    <span class="el-descriptions__content">{{ userRoles.email }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-row>
      <el-row>
        <span>
          <h4>User Roles</h4>
        </span>
        <div>
          <span v-for="(role, index) in userRoles.roles" :key="index" style="padding: 20px">
            {{ index + 1 }}.  {{ role }}
          </span></div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getApplicantList, getUserById } from '@/api/user'
import pagination from '@/components/Pagination'

export default {
  components: { pagination },
  filters: {
    datetimeFilter(status) {
      var d = new Date(status)
      return d.toLocaleDateString()
      // return d.toGMTString()
    },
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },

  data() {
    return {
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showRolesDialog: false,
      userRoles: [],
      // Pagination
      page: {
        // size: 1,
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true,
      // --end pagination
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        status: undefined,
        sort: '+id'
      },
      downloadLoading: false,
      addClient: false,
      title: 'Add Client',
      multipleSelection: []
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
        this.page = pageResponse
        this.newPage = false
      } else {
        this.page.totalElements = pageResponse.totalElements
        this.page.size = pageResponse.size
        this.page.number = pageResponse.number += 1
      }
    },
    fetchData() {
      this.listLoading = true
      getApplicantList(this.page.number, this.page.size, this.listQuery.title).then((response) => {
        // debugger
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
          this.filterPageData(response.data.page)
        } else {
          this.$message({
            message: response.message,
            showClose: true,
            type: 'info'
          })
        }
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    },
    getUserRoles(data) {
      this.viewRolesLoading = true
      getUserById(data.id).then((response) => {
        this.viewRolesLoading = false
        this.showRolesDialog = true
        this.title = 'User Details'
        this.userRoles = response.data
      }).catch(() => {
        this.viewRolesLoading = false
      })
    },
    handleFilter() {
      console.log('handle filter')
    }
  }
}
</script>

<style>
</style>
