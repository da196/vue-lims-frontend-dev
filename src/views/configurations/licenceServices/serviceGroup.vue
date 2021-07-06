<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_LICENSE_DETAIL_VIEW_ALL', 'ROLE_LICENSE_DETAIL_VIEW']"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_LICENSE_DETAIL_VIEW_ALL', 'ROLE_LICENSE_DETAIL_VIEW']"
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
        v-permission="['ROLE_LICENSE_DETAIL_VIEW_ALL', 'ROLE_LICENSE_DETAIL_VIEW']"
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
        v-permission="['ROLE_LICENSE_DETAIL_SAVE']"
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
      v-permission="['ROLE_LICENSE_DETAIL_VIEW_ALL', 'ROLE_LICENSE_DETAIL_VIEW']"
      element-loading-text="Loading"
      :data="list"
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | globalStatusFilter">{{ scope.row.active === true ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action" width="200">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_LICENSE_DETAIL_EDIT']"
            plain
            size="mini"
            type="warning"
            icon="el-icon-warning-outline"
            @click="editService(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_LICENSE_DETAIL_DELETE']"
            plain
            size="mini"
            type="danger"
            icon="el-icon-delete"
            :loading="viewRolesLoading"
            @click="deleteService(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="showLicenceServicesDialog" :title="title" width="50%">
      <el-form
        ref="service"
        :model="service"
        :rules="rules"
        label-width="140px"
        label-position="top"
      >

        <el-form-item label="Service Name" prop="name" required>
          <el-input v-model="service.name" />
        </el-form-item>
        <el-form-item label="Service Code" prop="code" required>
          <el-input v-model="service.code" />
        </el-form-item>
        <el-form-item v-if="title === 'Add Service'">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="submitForm('service')"
          >Create
          </el-button>
          <el-button plain size="mini" @click="resetForm('service')">Reset</el-button>
        </el-form-item>
        <el-form-item v-if="title === 'Edit Service'">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="submitFormEdit('service')"
          >Edit
          </el-button>
          <el-button plain size="mini" @click="clearDialog">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <pagination
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />
  </div>
</template>

<script>
import {
  createLicenceDetails,
  deleteLicenceDetails,
  getAllLicenceDetailsList,
  updateLicenceDetails
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import pagination from '@/components/Pagination'
import { globalStatusFilter } from '@/filters'

export default {
  name: 'LicenceDetails',
  components: { pagination },
  filters: {
    globalStatusFilter
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
      search: '',
      title: 'Add Service',
      list: [],
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showLicenceServicesDialog: false,
      service: {
        name: '',
        code: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Service name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: 'Please input Service Code',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    listServices() {
      return this.list.filter(data => !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.code.toLowerCase().includes(this.search.toLowerCase()))
    }
  }, created() {
    // TODO -- change the endpoint associated with the fetch data to change
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
      getAllLicenceDetailsList(this.page.number, this.page.size, this.listQuery.title).then(response => {
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
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createLicenceDetails(this.service).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Service created successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('service')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('service')
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
    submitFormEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const serviceId = this.service.id
          this.service = {
            name: this.service.name,
            code: this.service.code
          }
          updateLicenceDetails(this.service, serviceId).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Service edited successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('service')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('service')
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
    editService(data) {
      this.service = data
      this.title = 'Edit Service'
      this.showLicenceServicesDialog = true
    },
    clearDialog() {
      this.title = ''
      this.showLicenceServicesDialog = false
      this.service = {
        name: '',
        code: '',
        description: ''
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    deleteService(data) {
      this.$confirm('This will permanently delete the service. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteLicenceDetails(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Service deleted successfully.',
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
      }).catch(() => {})
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
      this.title = 'Add Service'
      this.showLicenceServicesDialog = true
      this.service = {}
    }
  }
}
</script>

<style scoped>

</style>
