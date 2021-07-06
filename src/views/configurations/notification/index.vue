<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_NOTIFICATION_TEMPLATE_VIEW']"
        placeholder="Search by name or Display name"
        style="width: 20rem"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_NOTIFICATION_TEMPLATE_VIEW']"
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
        v-permission="['ROLE_NOTIFICATION_TEMPLATE_VIEW']"
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
        v-permission="['ROLE_NOTIFICATION_TEMPLATE_SAVE']"
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
    <div class="">
      <el-table
        v-permission="['ROLE_NOTIFICATION_TEMPLATE_VIEW', 'ROLE_NOTIFICATION_TEMPLATE_VIEW_ALL','ROLE_NOTIFICATION_TEMPLATE_VIEW_ACTIVE']"
        v-loading="listLoading"
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
        <el-table-column label="Active" align="center" width="110">
          <template slot-scope="scope">
            <el-tag :type="scope.row.active | statusFilter">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span><br>
          </template>
        </el-table-column>
        <el-table-column label="Display Name" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.displayName }}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand" align="center" label="More" width="100">
          <template slot-scope="props">
            <p><b>Staff Email Template:</b> {{ props.row.staffEmailTemplate ? props.row.staffEmailTemplate : 'N/A' }}</p>
            <p><b>Email Template:</b> {{ props.row.emailTemplate ? props.row.emailTemplate : 'N/A' }}</p>
            <p><b>Text Template:</b> {{ props.row.textTemplate ? props.row.textTemplate : 'N/A' }}</p>
          </template>
        </el-table-column>
        <!--        <el-table-column label="Staff Email Template" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{ scope.row.staffEmailTemplate }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="Email Template" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{ scope.row.emailTemplate }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="Text Template" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{ scope.row.textTemplate }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column label="Action" align="center" prop="action">
          <template slot-scope="scope">
            <el-button
              v-permission="['ROLE_NOTIFICATION_TEMPLATE_EDIT']"
              plain
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
              Edit
            </el-button>
            <el-button
              v-if="scope.row.active === true"
              v-permission="['ROLE_NOTIFICATION_TEMPLATE_ACTIVATION_DEACTIVATION']"
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
              v-permission="['ROLE_NOTIFICATION_TEMPLATE_ACTIVATION_DEACTIVATION']"
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
        v-permission="['ROLE_NOTIFICATION_TEMPLATE_VIEW','ROLE_NOTIFICATION_TEMPLATE_VIEW_ALL']"
        :total="page.totalElements"
        :page.sync="page.number"
        :limit.sync="page.size"
        @pagination="getNextData"
      />
    </div>

    <el-dialog :visible.sync="showNotificationDialog" :title="title" width="50%">
      <el-form
        ref="notification"
        :model="notification"
        :rules="notificationRules"
        label-width="140px"
        label-position="top"
      >

        <el-form-item label="Notification Name" prop="name" required>
          <el-input v-model="notification.name" />
        </el-form-item>
        <el-form-item label="Notification Display Name" prop="displayName" required>
          <el-input v-model="notification.displayName" />
        </el-form-item>

        <el-form-item label="Staff  Email Template" prop="staffEmailTemplate">
          <el-input v-model="notification.staffEmailTemplate" type="textarea" />
        </el-form-item>

        <el-form-item label="Applicant Email Template" prop="emailTemplate">
          <el-input v-model="notification.emailTemplate" type="textarea" />
        </el-form-item>

        <el-form-item label="Applicant Text Template" prop="textTemplate">
          <el-input v-model="notification.textTemplate" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            v-permission="['ROLE_NOTIFICATION_TEMPLATE_SAVE']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitForm('notification')"
          >Create
          </el-button>
          <el-button
            v-if="actionType === 'edit'"
            v-permission="['ROLE_NOTIFICATION_TEMPLATE_EDIT']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('notification')"
          >Edit
          </el-button>
          <el-button plain size="mini" @click="resetForm('notification')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  createNotification,
  deactivateNotification,
  getListOfNotification,
  updateNotification
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import pagination from '@/components/Pagination'

export default {
  name: 'Index',
  components: { pagination },

  filters: {
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
      title: 'Add Notification',
      // Pagination
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true,
      // --end pagination
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showNotificationDialog: false,
      notification: {
        name: '',
        displayName: '',
        textTemplate: '',
        emailTemplate: '',
        staffEmailTemplate: ''
      },
      notificationRules: {
        name: [
          {
            required: true,
            message: 'Please input Notification name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        displayName: [
          {
            required: true,
            message: 'Please input Notification Display Name',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      },
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
      getListOfNotification(this.page.number, this.page.size, this.listQuery.title).then(response => {
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
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
          this.notification.emailTemplate = this.notification.emailTemplate === undefined ? ' ' : this.notification.emailTemplate
          this.notification.staffEmailTemplate = this.notification.staffEmailTemplate === undefined ? ' ' : this.notification.staffEmailTemplate
          this.notification.textTemplate = this.notification.textTemplate === undefined ? ' ' : this.notification.textTemplate
          createNotification(this.notification).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Notification created successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('notification')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('licenceForm')
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
    submitFormEdit: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          const submissionForm = {
            name: this.notification.name,
            displayName: this.notification.displayName,
            textTemplate: this.notification.textTemplate,
            emailTemplate: this.notification.emailTemplate,
            staffEmailTemplate: this.notification.staffEmailTemplate,
            id: this.notification.id
          }
          updateNotification(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Notification edited successfully.',
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
    },
    clearDialog() {
      this.title = ''
      this.showNotificationDialog = false
      this.submissionLoading = false
      this.dialogData = {}
      this.notification = {}
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
    handleDownload() {
      console.log('handle download')
    },
    handleModifyStatus(data) {
      console.log('handle modify status')
    },
    handleCreate() {
      this.title = 'Add Notification'
      this.showNotificationDialog = true
      this.actionType = 'create'
      this.dialogData = {}
      this.notification = {}
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently deactivate the Notification. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deactivateNotification(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Notification deactivate successfully.',
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
      this.title = 'Edit Notification'
      this.showNotificationDialog = true
      this.dialogData = data
      this.notification = data
    }
  }
}
</script>

<style scoped>

</style>
