<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_LICENSE_FORM_VIEW']"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_LICENSE_FORM_VIEW']"
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
        v-permission="['ROLE_LICENSE_FORM_VIEW']"
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
      :data="list"
      element-loading-text="Loading"
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="120rem">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | statusFilter">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center" width="120rem">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Licence Form Name " align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Form Type" align="left" resizable width="100rem">
        <template slot-scope="scope">
          <span>{{ scope.row.formType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action" width="300rem">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_LICENSE_FORM_VIEW']"
            plain
            size="mini"
            type="primary"
            icon="el-icon-view"
            :loading="viewRolesLoading"
            @click="getSubItems(scope.row)"
          >
            View
          </el-button>
          <el-button
            v-permission="['ROLE_LICENSE_FORM_EDIT']"
            plain
            size="mini"
            type="warning"
            icon="el-icon-warning-outline"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_LICENSE_FORM_ACTIVATION_DEACTIVATION']"
            plain
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDeactivate(scope.row)"
          >
            Delete
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showlicenceFormDialog" :title="title" width="50%">
      <el-form
        ref="licenceForm"
        :model="licenceForm"
        :rules="rules"
        label-width="140px"
        label-position="top"
      >
        <el-form-item label="Licence Form Name" prop="name" required>
          <el-input v-model="licenceForm.name" />
        </el-form-item>
        <el-form-item label="Licence Form Code" prop="code" required>
          <el-input v-model="licenceForm.code" />
        </el-form-item>
        <el-form-item label="Licence Form Description" prop="description" required>
          <el-input v-model="licenceForm.description" type="textarea" />
        </el-form-item>

        <el-form-item label="Licence Form Type" required>
          <el-select v-model="licenceForm.type">
            <el-option v-for="(item, key) in formTypesEnum" :key="key" :value="item.name" :label="item.displayName" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            v-permission="['ROLE_LICENSE_FORM_SAVE']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitForm('licenceForm')"
          >Create
          </el-button>
          <el-button
            v-if="actionType === 'edit'"
            v-permission="['ROLE_LICENSE_FORM_EDIT']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('licenceForm')"
          >Edit</el-button>
          <el-button
            plain
            size="mini"
            @click="resetForm('licenceForm')"
          >Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { createLicenceForm, deactivateLicenceForm, getListOfLicenceForms, updateLicenceForm } from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { encodeHashId } from '@/utils'

export default {
  name: 'Index',
  filters: {
    /**
     * @param {number} status
     */
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
        sort: '+id'
      },
      title: 'Add Licence Form',
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showlicenceFormDialog: false,
      submissionLoading: false,
      licenceForm: {
        name: '',
        code: '',
        description: '',
        type: ''
      },
      formTypesEnum: [
        {
          displayName: 'Evaluation Form',
          name: 'EVALUATION'
        },
        {
          displayName: 'Inspection Form',
          name: 'INSPECTION'
        }
      ],

      rules: {
        name: [
          {
            required: true,
            message: 'Please input Licence Form name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: 'Please input Licence Form Code',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        type: [
          {
            required: true,
            message: 'Please input Licence Form Type',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: 'Please input Licence Form Description',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      },
      actionType: 'create'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getListOfLicenceForms().then(response => {
        this.list = response.data.content
        this.listLoading = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.list = []
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showlicenceFormDialog = false
          createLicenceForm(this.licenceForm).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Licence Form created successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('licenceForm')
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
    clearDialog() {
      this.title = ''
      this.showlicenceFormDialog = false
      this.licenceForm = {
        name: '',
        code: '',
        description: ''
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getSubItems(data) {
      const encodedId = encodeHashId(data.id)
      this.$router.push({ name: 'itemType', params: { parentId: encodedId }})
    },
    handleFilter() {
      console.log('handle filter')
    },
    handleDownload() {
      console.log('handle download')
    },
    handleModifyStatus(data) {
      console.log('handle modify status')
    },
    handleCreate() {
      this.title = 'Add Licence Form'
      this.showlicenceFormDialog = true
      this.licenceForm = {}
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently deactivate the Licence Form. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deactivateLicenceForm(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Licence Form deactivate successfully.',
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
      this.title = 'Edit Licence Form'
      this.showlicenceFormDialog = true
      this.licenceForm = data
      this.licenceForm.type = data.formType
    },
    submitFormEdit: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showlicenceFormDialog = false
          const submissionForm = {
            name: this.licenceForm.name,
            code: this.licenceForm.code,
            description: this.licenceForm.description,
            id: this.licenceForm.id,
            type: this.licenceForm.type
          }
          updateLicenceForm(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'License Form edited successfully.',
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
