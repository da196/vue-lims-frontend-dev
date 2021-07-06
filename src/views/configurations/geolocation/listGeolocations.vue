<template>
  <div class="app-container">
    <!-- Start Top Search and Add Button -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_GEOLOCATION_VIEW', 'ROLE_GEOLOCATION_VIEW_ALL']"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        placeholder="Search by code or name"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_GEOLOCATION_VIEW', 'ROLE_GEOLOCATION_VIEW_ALL']"
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
        v-permission="['ROLE_GEOLOCATION_VIEW', 'ROLE_GEOLOCATION_VIEW_ALL']"
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
        v-permission="['ROLE_GEOLOCATION_SAVE']"
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
    <el-table
      v-loading="listLoading"
      v-permission="['ROLE_GEOLOCATION_VIEW_ALL', 'ROLE_GEOLOCATION_VIEW']"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | statusFilter">{{ scope.row.active === true ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Parent" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.parent ? scope.row.parent.name : 'N/A' }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="Date Created" align="center" prop="created_at">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class="el-icon-time" /> &ndash;&gt;-->
      <!--          <span>{{ scope.row.createdAt }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="Action" align="center" prop="action" width="230rem">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_GEOLOCATION_EDIT']"
            plain
            size="mini"

            type="warning"
            icon="el-icon-warning-outline"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_GEOLOCATION_DELETE']"
            plain
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDeactivate(scope.row)"
          > Delete </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <!-- Start Dialog -->
    <el-dialog :visible.sync="showDialog" :title="title" style="padding:20px 5px">
      <!-- start -->
      <el-form
        ref="geoLocationForm"
        :model="geoLocationForm"
        :rules="geoLocationRules"
        class="demo-ruleForm"

        label-width="150px"
      >
        <el-form-item label="Geolocation Type" prop="type">
          <el-col :span="11">
            <el-select v-model="geoLocationForm.type" style="width:400px;" placeholder="Please select your type">
              <el-option label="CONTINENT" value="CONTINENT" />
              <el-option label="COUNTRY" value="COUNTRY" />
              <el-option label="REGION" value="REGION" />
              <el-option label="DISTRICT" value="DISTRICT" />
              <el-option label="WARD" value="WARD" />
              <el-option label="VILLAGE" value="VILLAGE" />
              <el-option label="STREET" value="STREET" />
              <el-option label="ZONE" value="ZONE" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="Geolocation Name" prop="name">
          <el-input v-model="geoLocationForm.name" style="width:400px;" />
        </el-form-item>

        <el-form-item label="Geolocation Parent" prop="parentId">
          <el-select v-model="geoLocationForm.parentId" style="width:400px;" placeholder="Please select your parentID">
            <el-option label="No Parent" :value="0" />
            <el-option v-for="listLocation in list" :key="listLocation.id" :label="listLocation.name" :value="listLocation.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Geolocation Code" prop="code">
          <el-input v-model="geoLocationForm.code" style="width:400px;" />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormCreate('geoLocationForm')"
          >Create</el-button>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            @click="resetForm('geoLocationForm')"
          >Reset</el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('geoLocationForm')"
          >Edit</el-button>
          <el-button
            v-if="actionType === 'delete'"
            plain
            size="mini"
            type="danger"
            :loading="submissionLoading"
            @click="handleCreate('geoLocationForm')"
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
import {
  getAllGeolocationList,
  createGeoLocation,
  updateGeoLocation,
  deleteGeoLocation
} from '@/api/configurations'

import pagination from '@/components/Pagination'

export default {
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
        // size: 1,
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true,
      // --end pagination
      downloadLoading: false,
      showDialog: false,
      title: 'Add Geo Location',
      multipleSelection: [],
      geoLocationRules: {
        type: [{ required: true, message: 'Please enter the geo location type', trigger: 'blur' }],
        name: [{ required: true, message: 'Please enter the geo location name', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the geo location code', trigger: 'blur' }]
        // parentId: [{ required: true, message: 'Please enter the geo location parent Id', trigger: 'blur' }]
      },
      geoLocationForm: {
        type: '',
        name: '',
        parentId: '',
        code: ''
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
      getAllGeolocationList(this.page.number, this.page.size, this.listQuery.title).then((response) => {
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
          createGeoLocation(this.geoLocationForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Geo Location was saved successfully.',
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
            code: this.geoLocationForm.code,
            type: this.geoLocationForm.type,
            name: this.geoLocationForm.name,
            parentId: this.geoLocationForm.parentId,
            id: this.geoLocationForm.id
          }
          updateGeoLocation(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Geo location edited successfully.',
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
      this.geoLocationForm = {}
      this.submissionLoading = false
      this.resetForm('geoLocationForm')
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
      this.title = 'Add Geo Location'
      this.actionType = 'create'
      this.showDialog = true
      this.dialogData = {}
    },
    handleView(data) {
      this.title = 'Geo Location'
      this.showDialog = true
      this.dialogData = data
    },
    handleEdit(data) {
      this.title = 'Edit Geo Location'
      this.actionType = 'edit'
      this.showDialog = true
      this.dialogData = data
      this.geoLocationForm = data
      this.geoLocationForm.parentId = data.parent === null ? 0 : data.parent.name
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently delete the Geolocation. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteGeoLocation(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Geolocation deleted successfully.',
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

<style scoped>

</style>
