<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_STATUS_VIEW_ALL', 'ROLE_STATUS_VIEW', 'ROLE_STATUS_VIEW_ACTIVE']"
        placeholder="Search by name, group, phase"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_STATUS_VIEW_ALL', 'ROLE_STATUS_VIEW', 'ROLE_STATUS_VIEW_ACTIVE']"
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
      <el-button
        v-if="listQuery.showClear"
        v-permission="['ROLE_STATUS_VIEW_ALL', 'ROLE_STATUS_VIEW', 'ROLE_STATUS_VIEW_ACTIVE']"
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="info"
        icon="el-icon-minus"
        @click="handleClearQuery"
      >
        Clear
      </el-button>
      <el-button
        v-permission="['ROLE_STATUS_SAVE']"
        plain
        size="mini"
        class="filter-item"
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
      v-permission="['ROLE_STATUS_VIEW_ALL', 'ROLE_STATUS_VIEW', 'ROLE_STATUS_VIEW_ACTIVE']"
      :data="list"
      element-loading-text="Loading"
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="100rem">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | globalStatusFilter">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Status Name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phase " align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.phase }}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" label="More Details" align="center" width="120">
        <template slot-scope="scope">
          <p><b>Description:</b>  {{ scope.row.description }} </p>
          <p> <b>Display Name:  </b> {{ scope.row.displayName }} </p>
          <p> <b>Group:</b> {{ scope.row.group }} </p>
        </template>
      </el-table-column>

      <el-table-column label="Action" align="center" prop="action" width="250rem&quot;">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_STATUS_EDIT']"
            plain
            size="mini"

            type="warning"
            icon="el-icon-warning-outline"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-if="scope.row.active === true"
            v-permission="['ROLE_STATUS_ACTIVATION_DEACTIVATION']"
            plain
            size="mini"

            type="danger"
            icon="el-icon-delete"
            @click="handleDeactivate(scope.row)"
          >
            Deactivate
          </el-button>
          <el-button
            v-if="scope.row.active !== true"
            v-permission="['ROLE_STATUS_ACTIVATION_DEACTIVATION']"
            plain
            size="mini"

            type="success"
            icon="el-icon-refresh-right"
            @click="handleDeactivate(scope.row)"
          >
            Activate
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-permission="['ROLE_STATUS_VIEW_ALL', 'ROLE_STATUS_VIEW', 'ROLE_STATUS_VIEW_ACTIVE']"
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <el-dialog :visible.sync="showlicenceStatusDialog" :title="title" width="50%">
      <el-form
        ref="licenceStatus"
        :model="licenceStatus"
        :rules="licenceStatusRules"
        label-width="140px"
        label-position="top"
      >
        <el-form-item label="Name" prop="name" required>
          <el-input v-model="licenceStatus.name" />
        </el-form-item>
        <el-form-item label="Display Name" prop="displayName" required>
          <el-input v-model="licenceStatus.displayName" />
        </el-form-item>
        <el-form-item label="Description" prop="description" required>
          <el-input v-model="licenceStatus.description" type="textarea" />
        </el-form-item>
        <el-form-item label="Phase" prop="phase" required>
          <el-input v-model="licenceStatus.phase" />
        </el-form-item>
        <el-form-item label="Group" prop="group" required>
          <el-input v-model="licenceStatus.group" />
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitForm('licenceStatus')"
          >Create
          </el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('licenceStatus')"
          >Edit</el-button>
          <el-button plain size="mini" @click="resetForm('licenceStatus')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { createLicenceStatus, deactivateLicenceStatus, getListOfLicenceStatus, updateLicenceStatus } from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import pagination from '@/components/Pagination'
import { globalStatusFilter } from '@/filters'

export default {
  name: 'Index',
  filters: {
    globalStatusFilter
  },
  components: {
    pagination
  },
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
      title: 'Add Licence Status',
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showlicenceStatusDialog: false,
      licenceStatus: {
        name: '',
        displayName: '',
        phase: '',
        group: '',
        description: ''
      },
      licenceStatusRules: {
        name: [
          {
            required: true,
            message: 'Please input Licence Status name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        displayName: [
          {
            required: true,
            message: 'Please input Display Name',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        phase: [
          {
            required: true,
            message: 'Please input Phase',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        group: [
          {
            required: true,
            message: 'Please input Group',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        description: [
          {
            required: true,
            message: 'Please input Description',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      },
      // Pagination
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // --end pagination
      submissionLoading: false,
      actionType: 'create'
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
      getListOfLicenceStatus(this.page.number, this.page.size, this.listQuery.title).then(response => {
        this.listLoading = false
        this.list = response.data.content
        if (response.data) {
          this.filterPageData(response.data.page)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.list = []
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          createLicenceStatus(this.licenceStatus).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Licence Status created successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('licenceStatus')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('licenceStatus')
            this.$message({
              message: 'Sorry, Something went wrong.',
              showClose: true,
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearDialog() {
      this.title = ''
      this.submissionLoading = false
      this.showlicenceStatusDialog = false
      this.licenceStatus = {
        name: '',
        displayName: '',
        phase: '',
        group: '',
        description: ''
      }
    },
    resetForm(formName) {
      this.$refs[formName]?.resetFields()
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
    },

    // handleFilter() {
    //   console.log('handle filter')
    // },
    handleDownload() {
      console.log('handle download')
    },
    handleModifyStatus(data) {
      console.log('handle modify status')
    },
    handleCreate() {
      this.title = 'Add Licence Status'
      this.actionType = 'create'
      this.showlicenceStatusDialog = true
      this.licenceStatus = {}
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently deactivate the Licence Status. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deactivateLicenceStatus(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Licence Status deactivate successfully.',
              showClose: true,
              type: 'success'
            })
            this.fetchData()
          }
        }).catch(() => {
          this.$message({
            message: 'Sorry, Something went wrong.',
            showClose: true,
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Deactivate canceled'
        })
      })
    },
    handleEdit(data) {
      this.actionType = 'edit'
      this.title = 'Edit Licence Status'
      this.showlicenceStatusDialog = true
      this.licenceStatus = data
    },
    submitFormEdit: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          const submissionForm = {
            name: this.licenceStatus.name,
            displayName: this.licenceStatus.displayName,
            phase: this.licenceStatus.phase,
            group: this.licenceStatus.group,
            description: this.licenceStatus.description,
            id: this.licenceStatus.id
          }
          updateLicenceStatus(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'License Status edited successfully.',
                showClose: true,
                type: 'success'
              })
            }
          }).catch(() => {
            this.clearDialog()
            this.$message({
              message: 'Sorry, Something went wrong.',
              showClose: true,
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
