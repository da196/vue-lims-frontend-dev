<template>
  <div class="app-container">

    <!-- Start Top Search and Add Button -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_LIST_OF_VALUES_VIEW', 'ROLE_LIST_OF_VALUES_VIEW']"
        placeholder="Search by name, code or list type"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_LIST_OF_VALUES_VIEW', 'ROLE_LIST_OF_VALUES_VIEW']"
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
        v-permission="['ROLE_LIST_OF_VALUES_VIEW', 'ROLE_LIST_OF_VALUES_VIEW']"
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
        v-permission="['ROLE_LIST_OF_VALUES_SAVE']"
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
    <!-- End Top Search and Add Button -->

    <!-- Start Table -->
    <el-table
      v-permission="['ROLE_LIST_OF_VALUES_VIEW', 'ROLE_LIST_OF_VALUES_VIEW']"
      v-loading="listLoading"
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
      <el-table-column label="Active" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | globalStatusFilter">{{ scope.row.active }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="List Type" align="left" width="200rem">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_LIST_OF_VALUES_EDIT']"
            plain
            size="mini"
            type="warning"
            icon="el-icon-warning-outline"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_LIST_OF_VALUES_DELETE']"
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
    <!-- End Table -->
    <pagination
      v-permission="['ROLE_LIST_OF_VALUES_VIEW', 'ROLE_LIST_OF_VALUES_VIEW']"
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />
    <!-- Start Dialog -->
    <el-dialog :visible.sync="showDialog" :title="title" style="padding:20px 5px">
      <!-- start -->
      <el-form
        ref="listOfValueForm"
        :model="listOfValueForm"
        :rules="listOfValueRules"
        class="demo-ruleForm"
        size="mini"
        label-width="150px"
      >

        <el-form-item label="Name" prop="name">
          <el-input v-model="listOfValueForm.name" style="width:400px;" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input v-model="listOfValueForm.description" type="textarea" style="width:400px;" />
        </el-form-item>

        <el-form-item label="Type" prop="type">
          <el-select v-model="listOfValueForm.type" style="width:400px;" placeholder="Please select your type">
            <el-option label="CURRENCY" value="CURRENCY" />
            <el-option label="FEE TYPE" value="FEETYPE" />
            <el-option label="FACILITY OWNER CATEGORY" value="FACILITYOWNERCATEGORY" />
            <el-option label="TRANSMISSION RESOURCES" value="TRANSMISSIONRESOURCES" />
            <el-option label="AUTHORITY NOTIFICATION" value="AUTHORITYNOTIFICATION" />
          </el-select>
        </el-form-item>

        <el-form-item label="Code" prop="code">
          <el-input v-model="listOfValueForm.code" style="width:400px;" />
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormCreate('listOfValueForm')"
          >Create</el-button>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            @click="resetForm('listOfValueForm')"
          >Reset</el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('listOfValueForm')"
          >Edit</el-button>
          <el-button
            v-if="actionType === 'delete'"
            plain
            size="mini"
            type="danger"
            :loading="submissionLoading"
            @click="handleCreate('listOfValueForm')"
          >Delete</el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            @click="clearDialog()"
          >Cancel</el-button>
        </el-form-item>

      </el-form>

      <!-- end -->

    </el-dialog>
    <!-- End Dialog -->

  </div>
</template>

<script>
import { statusCodes } from '@/utils/status-codes'

import { getAllListOfValueList, createListOfValue, updateListOfValue, deleteListOfValue } from '@/api/configurations'
import pagination from '@/components/Pagination'
import { globalStatusFilter } from '@/filters'

export default {
  components: { pagination },
  filters: {
    globalStatusFilter
  },
  data() {
    return {
      list: null,
      listLoading: true,
      viewItemLoading: false,
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
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true,
      // --end pagination
      downloadLoading: false,
      showDialog: false,
      title: 'Add List of Value',
      multipleSelection: [],
      listOfValueRules: {
        name: [{ required: true, message: 'Please enter the name', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter the description', trigger: 'blur' }],
        type: [{ required: true, message: 'Please enter the type', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the code', trigger: 'blur' }]
      },
      listOfValueForm: {
        name: '',
        description: '',
        type: '',
        code: '',
        parentId: 0
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
      getAllListOfValueList(this.page.number, this.page.size, this.listQuery.title).then((response) => {
        // debugger
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
    // Submit create FROM API
    submitFormCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          createListOfValue(this.listOfValueForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'List of Value was saved successfully.',
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
            name: this.listOfValueForm.name,
            description: this.listOfValueForm.description,
            code: this.listOfValueForm.code,
            type: this.listOfValueForm.type,
            parentId: this.listOfValueForm.parentId,
            id: this.listOfValueForm.id
          }
          updateListOfValue(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'List of value was edited successfully.',
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
      this.listOfValueForm = {}
      this.submissionLoading = false
      this.resetForm('listOfValueForm')
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
    handleCreate() {
      this.title = 'Add List of Value'
      this.actionType = 'create'
      this.showDialog = true
      this.dialogData = {}
    },
    handleView(data) {
      this.title = 'List of Value'
      this.showDialog = true
      this.dialogData = data
    },
    handleEdit(data) {
      this.title = 'Edit List of Value'
      this.actionType = 'edit'
      this.showDialog = true
      this.dialogData = data
      this.listOfValueForm = data
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently delete the List of Value. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteListOfValue(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'List of Value was deleted successfully.',
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
          message: 'Delete canceled'
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
</style>
