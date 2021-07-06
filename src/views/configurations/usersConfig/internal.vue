<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_USER_VIEW_ALL']"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_USER_VIEW_ALL']"
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
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        Add User
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      v-permission="['ROLE_USER_VIEW_ALL']"
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
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status === true ? 'Active' : 'Inactive' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Full name">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName ? scope.row.firstName : 'N/A' }}  {{ scope.row.middleName }}  {{ scope.row.lastName }} </span>
        </template>
      </el-table-column>
      <el-table-column label="Email">
        <template slot-scope="scope">
          <span>{{ scope.row.email? scope.row.email : 'N/A' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="success"
            @click="getUserRoles(scope.row)"
          >
            View Details
          </el-button>

          <el-button
            plain
            size="mini"
            type="primary"
            @click="editUserRoles(scope.row)"
          >
            Edit User
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

    <el-dialog :visible.sync="addClient" :title="title">
      <div v-loading="editRolesLoading" class="">
        <el-form>
          <el-form-item label="Roles">
            <el-select v-model="userBasedRoles" placeholder="Select User Role" filterable>
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button
            plain
            size="mini"
            type="success"
            style="float: right"
            @click="saveUserRole"
          > Save Role</el-button>
          <el-button
            plain
            size="mini"
            type="info"
            @click.prevent="addClient = !addClient"
          > Cancel</el-button>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showRolesDialog" :title="title" width="75%">
      <el-row v-loading="viewRolesLoading">
        <div class="el-descriptions">
          <div class="el-descriptions__body">
            <table class="">
              <tbody>
                <tr>
                  <td colspan="2">
                    <span class="el-descriptions__label">Name:</span>
                    <span class="el-descriptions__content">{{ userRoles.firstName ? userRoles.firstName : 'N/A' }}  {{ userRoles.middleName }} {{ userRoles.lastName }} </span>
                  </td>
                  <td colspan="2">
                    <span class="el-descriptions__label">Phone Number:</span>
                    <span class="el-descriptions__content">{{ userRoles.phone ? userRoles.phone : 'N/A' }}</span>
                  </td>
                  <td colspan="2">
                    <span class="el-descriptions__label">Email:</span>
                    <span class="el-descriptions__content">{{ userRoles.email ? userRoles.email : 'N/A' }}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="el-descriptions__label">User Roles</span>
                    <span class="el-descriptions__content">{{ userRoles.role }} </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="showCreateUserDialog" title="Create User">
      <el-form
        ref="userDetails"
        :model="userDetails"
        :rules="userDetailsRules"
        label-width="140px"
        label-position="left"
      >

        <el-form-item label="First Name" prop="firstName" required>
          <el-input v-model="userDetails.firstName" />
        </el-form-item>
        <el-form-item label="Middle Name" prop="middleName" required>
          <el-input v-model="userDetails.middleName" />
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName" required>
          <el-input v-model="userDetails.lastName" />
        </el-form-item>
        <el-form-item label="Email Address" prop="email" required>
          <el-input v-model="userDetails.email" type="email" />
        </el-form-item>
        <el-form-item label="Phone No." prop="phone" required>
          <el-input v-model="userDetails.phone" type="number" />
        </el-form-item>
        <el-form-item label="Is Internal Staff">
          <el-checkbox v-model="userDetails.adAuthentication" label="Is TCRA staff" />
        </el-form-item>
        <el-form-item>
          <el-button
            plain
            size="mini"
            type="primary"
            @click="submitSaveUser()"
          >Save
          </el-button>
          <el-button plain size="mini" @click="clearDialog">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { assignUserRole, createUser, getAllRolesList, getList, getUserById } from '@/api/user'
import { statusCodes } from '@/utils/status-codes'
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
      showCreateUserDialog: false,
      viewRolesLoading: false,
      editRolesLoading: false,
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
      userBasedRoles: [],
      downloadLoading: false,
      addClient: false,
      title: 'Add Client',
      multipleSelection: [],
      rolesList: [],
      userDetails: {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        adAuthentication: false
      },
      userDetailsRules: {
        firstName: [{ required: true, message: 'Please enter your First Name', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Please enter your Last Name', trigger: 'blur' }],
        email: [{ required: true, message: 'Please enter your email address', trigger: 'blur' }],
        phone: [{ required: true, message: 'Please enter your phone number', trigger: 'blur' }]
      },
      // Pagination
      page: {
        // size: 1,
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true
      // --end pagination
    }
  },
  computed: {
    ...mapGetters('client', ['GetClientResponse']),
    computedUserRoles() {
      return this.userRoles?.roles ? this.userRoles.roles[0]?.id : 0
    }

  },
  created() {
    this.fetchData()
    this.getAvaliableRoles()
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    fetchData() {
      this.listLoading = true
      getList(this.page.number, this.page.size).then((response) => {
        // debugger
        this.list = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    },
    saveUserRole() {
      const r = [this.userBasedRoles]
      console.log(r)
      assignUserRole(this.userRoles.id, r).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: 'Roles updated successfully',
            type: 'success'
          })
        }
      })
      this.addClient = false
      // console.log(this.userBasedRoles)
    },
    getAvaliableRoles() {
      if (this.rolesList.length > 0) {
        return this.rolesList
      } else {
        getAllRolesList().then(response => {
          this.rolesList = response.data.content
        })
      }
    },
    // assignUserRole
    getUserRoles(data) {
      this.title = 'User Details'
      this.showRolesDialog = true
      this.viewRolesLoading = true
      getUserById(data.id).then((response) => {
        this.viewRolesLoading = false
        this.userRoles = response.data
      }).catch(() => {
        this.viewRolesLoading = false
      })
    },

    getUserDetailsById(id) {
      return new Promise(resolve => {
        getUserById(id).then((response) => {
          this.userRoles = response.data
        })
        resolve()
      })
    },
    async editUserRoles(data) {
      this.title = 'Edit User'
      this.editRolesLoading = true
      this.addClient = true
      getUserById(data.id).then((response) => {
        this.userRoles = response.data
        this.editRolesLoading = false
        this.userBasedRoles = this.computedUserRoles
      })
    },
    handleFilter() {
      console.log('handle filter')
    },
    handleCreate() {
      this.showCreateUserDialog = true
    },
    submitSaveUser() {
      this.$refs.userDetails.validate((valid) => {
        if (valid) {
          this.showCreateUserDialog = false
          createUser(this.userDetails).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'User created successfully',
                type: 'success'
              })
              this.clearDialog()
              this.fetchData()
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    clearDialog() {
      this.showCreateUserDialog = false
      this.userDetails = {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        adAuthentication: false
      }
      this.$refs?.userDetails?.resetFields()
    }

  }
}
</script>

<style>
</style>
