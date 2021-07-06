<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_ATTACHMENTS_TYPE_VIEW', 'ROLE_ATTACHMENTS_TYPE_VIEW_ALL']"
        placeholder="Search by Name, Purpose"
        style="width: 20rem"
        size="mini"
        class="filter-item"

        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_ATTACHMENTS_TYPE_VIEW', 'ROLE_ATTACHMENTS_TYPE_VIEW_ALL']"
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
        v-permission="['ROLE_ATTACHMENTS_TYPE_VIEW', 'ROLE_ATTACHMENTS_TYPE_VIEW_ALL']"
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
        v-permission="['ROLE_ATTACHMENTS_TYPE_SAVE']"
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
      v-permission="['ROLE_ATTACHMENTS_TYPE_VIEW_ALL', 'ROLE_ATTACHMENTS_TYPE_VIEW']"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | statusFilter">{{ scope.row.active === true? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span style="word-break: break-word"> {{ scope.row.name }} </span>
        </template>
      </el-table-column>
      <el-table-column label="Is Primary" align="center" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPrimary | globalStatusFilter">{{ scope.row.isPrimary === true ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Purpose" align="left" prop="purpose">
        <template slot-scope="scope">
          <span> {{ scope.row.attachmentTypePurpose }} </span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_ATTACHMENTS_TYPE_EDIT']"
            plain
            size="mini"

            type="warning"
            icon="el-icon-warning-outline"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_ATTACHMENTS_TYPE_DELETE']"
            plain
            size="mini"

            type="danger"
            icon="el-icon-delete"
            @click="handleDeactivate(scope.row)"
          >
            Deactivate
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

    <el-dialog :visible.sync="showDialog" :title="title">
      <el-form
        ref="attachmentTypeForm"
        :model="attachmentTypeForm"
        :rules="attachmentTypeRules"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="Attachment Type Name" prop="name">
          <el-input v-model="attachmentTypeForm.name" />
        </el-form-item>
        <el-form-item label="Attachement Required?" prop="isPrimary">
          <el-checkbox v-model="attachmentTypeForm.isPrimary" :inactive-value="false" :active-value="true" />
        </el-form-item>
        <el-form-item label="Attachment Type Purpose" prop="attachmentTypePurpose">
          <el-select
            v-model="attachmentTypeForm.attachmentTypePurpose"
            placeholder="Attachment Type Purpose"
            filterable
          >
            <el-option
              v-for="item in attachmentTypePurposeEnum"
              :key="item.key"
              :label="item.display"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Attachment Type Description" prop="description">
          <el-input v-model="attachmentTypeForm.description" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            v-permission="['ROLE_ATTACHMENTS_TYPE_SAVE']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormCreate('attachmentTypeForm')"
          >Create</el-button>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            @click="resetForm('attachmentTypeForm')"
          >Reset</el-button>
          <el-button
            v-if="actionType === 'edit'"
            v-permission="['ROLE_ATTACHMENTS_TYPE_EDIT']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('attachmentTypeForm')"
          >Edit</el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            @click="clearDialog()"
          >Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getAllAttachmentsTypeList,
  createAttachmentType,
  updateAttachmentType,
  deleteAttachmentType
} from '@/api/configurations'
import { globalStatusFilter } from '@/filters'
import { statusCodes } from '@/utils/status-codes'
import pagination from '@/components/Pagination'

export default {
  components: { pagination },
  filters: {
    globalStatusFilter,
    datetimeFilter(status) {
      var d = new Date(status)
      return d.toLocaleDateString()
      // return d.toGMTString()
    },
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'gray'
      }
      return statusMap[status]
    },
    enumFilter(enumString) {
      // return enumString.replace(/^_*(.)|_+(.)/g, (enumString, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
      return enumString.replace('_', ' ').toLowerCase()
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        status: undefined,
        showClear: false
        // sort: '+id'
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
      downloadLoading: false,
      showDialog: false,
      title: 'Add Attachment',
      multipleSelection: [],
      attachmentTypePurposeEnum: [
        { key: 'LICENSEAPPLICATION', display: 'License Application' },
        { key: 'PROFILEENTITY', display: 'Profile Entity' },
        { key: 'PROFILEINDIVIDUAL', display: 'Profile Individual' },
        { key: 'LICENCE', display: 'Licence' },
        { key: 'CONTENT', display: 'Licence Content' },
        { key: 'ACTIVITY', display: 'Activity' },
        { key: 'OTHER', display: 'Other' }
      ],
      attachmentTypeRules: {
        name: [{ required: true, message: 'Please enter the attachment type name', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter the attachment type description', trigger: 'blur' }],
        attachmentTypePurpose: [{ type: 'enum', enum: ['LICENSEAPPLICATION', 'PROFILEENTITY', 'PROFILEINDIVIDUAL', 'LICENCE', 'CONTENT', 'ACTIVITY', 'OTHER'], required: true, message: 'Please select the attachment type purpose', trigger: 'blur' }]
      },

      attachmentTypeForm: {
        attachmentTypePurpose: '',
        description: '',
        isPrimary: true,
        name: ''
      },

      //   name: '',
      //   description: '',
      //   code: ''
      // },
      submissionLoading: false,
      actionType: 'create'
      // hasCargoSelection:''
    }
  },
  computed: {
    ...mapGetters('client', ['GetClientResponse']),

    hasCargoSelection: function() {
      return this.multipleSelection.length !== 0
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    closeDialog(params) {
      console.log(params)
      this.showDialog = false
    },
    fetchData() {
      this.listLoading = true
      getAllAttachmentsTypeList(this.page.number, this.page.size, this.listQuery.title).then((response) => {
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
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    },
    submitFormCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          console.log(this.attachmentTypeForm)
          createAttachmentType(this.attachmentTypeForm).then((response) => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Attachment Type saved successfully.',
                showClose: true,
                type: 'success'
              })
              this.fetchData()
              this.clearDialog()
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
    submitFormEdit: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          // console.log(this.attachmentTypeForm)
          // debugger
          updateAttachmentType(this.attachmentTypeForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Attachment Type edited successfully.',
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
      this.showDialog = false
      this.dialogData = {}
      this.attachmentTypeForm = {
        attachmentTypePurpose: '',
        description: '',
        isPrimary: true,
        name: ''
      }
      this.submissionLoading = false
      this.resetForm('attachmentTypeForm')
    },
    handleCreate() {
      this.attachmentTypeForm = {}
      this.title = 'Add Attachment Type'
      this.showDialog = true
      this.actionType = 'create'
    },
    handleEdit(data) {
      this.title = 'Add Attachment Type'
      this.showDialog = true
      this.attachmentTypeForm = data
      this.actionType = 'edit'
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently delete the attachment type. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteAttachmentType(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Attachment Type deleted successfully.',
              showClose: true,
              type: 'success'
            })
            this.fetchData()
          }
        }).catch(() => {
          this.clearDialog()
          this.$message({
            message: 'Sorry, Something went wrong.',
            showClose: true,
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
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
    handleConsolidation() {
      console.log('handle cargo consolidation')
    }
  }
}
</script>

<style>
</style>
