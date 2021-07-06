<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_ENTITY_CATEGORY_VIEW_ALL', 'ROLE_ENTITY_CATEGORY_VIEW_DETAILS']"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_ENTITY_CATEGORY_VIEW_ALL', 'ROLE_ENTITY_CATEGORY_VIEW_DETAILS']"
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
        v-permission="[ 'ROLE_ENTITY_CATEGORY_ADD']"
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
      v-permission="['ROLE_ENTITY_CATEGORY_VIEW_ALL', 'ROLE_ENTITY_CATEGORY_VIEW_DETAILS']"
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
      <el-table-column label="active" align="center" width="150rem">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | globalStatusFilter">{{ scope.row.active === true ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center" width="150rem">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span style="word-break: break-word"> {{ scope.row.name }} </span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_ENTITY_CATEGORY_EDIT']"
            plain
            size="mini"
            type="warning"
            icon="el-icon-warning-outline"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>

          <!--          <el-button-->
          <!--            -->
          <!--            type="danger"-->
          <!--            disabled-->
          <!--          >-->
          <!--            Deactivate-->
          <!--          </el-button>-->
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :visible.sync="showDialog" :title="title">
      <el-form
        ref="entityCategoryForm"
        :model="entityCategoryForm"
        :rules="entityCategoryRules"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="Entity Category Code" prop="code">
          <el-input v-model="entityCategoryForm.code" />
        </el-form-item>
        <el-form-item label="Entity Category Name" prop="name">
          <el-input v-model="entityCategoryForm.name" />
        </el-form-item>
        <el-form-item label="Entity Category Description" prop="description">
          <el-input v-model="entityCategoryForm.description" />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormCreate('entityCategoryForm')"
          >Create</el-button>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            @click="resetForm('entityCategoryForm')"
          >Reset</el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('entityCategoryForm')"
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
import { createEntityCategory, getAllEntityCategoriesList, updateEntityCategory } from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { globalStatusFilter } from '@/filters'

export default {
  name: 'Index',
  filters: {
    globalStatusFilter
  },
  data() {
    return {
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      showRolesDialog: false,
      userRoles: [],
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
      showDialog: false,
      title: 'Add Entity Category',
      multipleSelection: [],
      entityCategoryRules: {
        name: [{ required: true, message: 'Please enter the entity category name', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter the entity category description', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the entity category code', trigger: 'blur' }]
      },
      entityCategoryForm: {
        name: '',
        description: '',
        code: ''
      },
      submissionLoading: false,
      actionType: 'create'
    }
  }, created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAllEntityCategoriesList().then((response) => {
        this.list = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    },
    submitFormCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          createEntityCategory(this.entityCategoryForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Entity Category saved successfully.',
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
    submitFormEdit: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          const submissionForm = {
            code: this.entityCategoryForm.code,
            name: this.entityCategoryForm.name,
            description: this.entityCategoryForm.description,
            id: this.entityCategoryForm.id
          }
          updateEntityCategory(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Entity Category saved successfully.',
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

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleFilter() {

    },
    handleCreate() {
      this.title = 'Add Entity Category'
      this.actionType = 'create'
      this.showDialog = true
      this.dialogData = {}
    },
    handleView(data) {
      this.title = 'Entity Category'
      this.showDialog = true
      this.dialogData = data
    },
    handleEdit(data) {
      this.title = 'Edit Entity Category'
      this.actionType = 'edit'
      this.showDialog = true
      this.dialogData = data
      this.entityCategoryForm = data
    },
    handleDeactivate() {
    },
    clearDialog() {
      this.title = ''
      this.showDialog = false
      this.dialogData = {}
      this.entityCategoryForm = {}
      this.submissionLoading = false
      this.resetForm('entityCategoryForm')
    }
  }
}
</script>

<style scoped>

</style>
