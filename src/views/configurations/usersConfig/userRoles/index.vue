<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
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
      <el-button
        v-permission="['ROLE_ROLE_CREATE', 'ROLE_ROLE_EDIT']"
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
      size="mini"
      fit
      highlight-current-row
      :default-sort="{prop: 'name', order: 'ascending'}"
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Code" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" sortable>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Date Created" prop="created_at" width="160">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.createdAt | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_ROLE_VIEW_DETAILS']"
            plain
            size="mini"
            type="info"
            @click="handleView(scope.row)"
          >
            View
          </el-button>
          <el-button
            v-permission="['ROLE_ROLE_EDIT']"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_ROLE_ASSIGN_PERMISSIONS', 'ROLE_ROLE_EDIT']"
            plain
            size="mini"
            type="success"
            @click="handleAddPerms(scope.row)"
          >
            View Permissions
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :visible.sync="showDialog" :title="title" width="60%">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="Role Code" prop="code">
          <el-input v-model="roleForm.code" :disabled="actionType === 'view' ? true : false " />
        </el-form-item>
        <el-form-item label="Role Name" prop="name">
          <el-input v-model="roleForm.name" :disabled="actionType === 'view' ? true : false " />
        </el-form-item>
        <el-form-item label="Role Description" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :disabled="actionType === 'view' ? true : false " />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormCreate('roleForm')"
          >Create
          </el-button>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            @click="resetForm('roleForm')"
          >Reset
          </el-button>
          <el-button
            v-if="actionType === 'edit'"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('roleForm')"
          >Edit
          </el-button>
          <el-button
            v-if="actionType === 'edit' || actionType === 'view'"
            plain
            size="mini"
            @click="clearDialog()"
          >Cancel
          </el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog :visible.sync="showPermissions" title="User Permissions" width="75%">
      <div v-loading="permsLoading">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(value, name, index) in groupedPerms" :key="index" :title="name" :name="index">
            <el-row>
              <el-checkbox
                v-for="(subItems) in value"
                :key="subItems.id"
                :checked="validatedChecked(subItems.id)"
                @change="addToSelectedItems(subItems.id)"
              >{{ subItems.displayName }}
              </el-checkbox>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-row style="margin-top: 2em">
          <el-button
            plain
            size="mini"
            type="warning"
            @click="updateUserRoles()"
          >Edit
          </el-button>
        </el-row>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { statusCodes } from '@/utils/status-codes'
import { groupBy } from '@/filters'
import { mapGetters } from 'vuex'
import { createRole, getAllRolesList, getRoleById, updateRole, updateRolePermissions } from '@/api/user'

export default {
  name: 'Index',
  data() {
    return {
      perms: undefined,
      list: [],
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
      title: 'Add Role',
      multipleSelection: [],
      roleRules: {
        name: [{ required: true, message: 'Please enter the role name', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter the role description', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the role code', trigger: 'blur' }]
      },
      roleForm: {
        name: '',
        description: '',
        code: ''
      },
      groupedPerms: [],
      user_selected_perms: {
        permissions: [],
        roleID: 0
      },
      roleDetails: {},
      submissionLoading: false,
      actionType: 'create',
      activeName: '1',
      showPermissions: false,
      permsLoading: false
    }
  },
  computed: {
    ...mapGetters('roles', ['getPerms', 'isLoading'])
  },
  created() {
    this.fetchData()
    this.loadPermissions()
  },
  methods: {
    validatedChecked(id) {
      if (this.user_selected_perms.permissions.includes(id)) {
        return true
      } else {
        return false
      }
    },
    addToSelectedItems(id) {
      this.user_selected_perms.permissions.indexOf(id) === -1
        ? this.user_selected_perms.permissions.push(id)
        : this.user_selected_perms.permissions
          .splice(this.user_selected_perms.permissions.indexOf(id), 1)
    },
    fetchData() {
      this.listLoading = true
      getAllRolesList().then((response) => {
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
          // attach
          createRole(this.roleForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Role saved successfully.',
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
            code: this.roleForm.code,
            name: this.roleForm.name,
            description: this.roleForm.description,
            id: this.roleForm.id
          }
          updateRole(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Role updated successfully.',
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

    updateUserRoles() {
      updateRolePermissions(this.user_selected_perms).then((response) => {
        this.fetchData()
        this.clearDialog()

        if (response.code === statusCodes.SUCCESS) {
          this.$message({
            message: 'Role Permissions updated successfully.',
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
    },
    async handleAddPerms(data) {
      this.groupedPerms = []
      this.showPermissions = true
      this.permsLoading = true
      getRoleById(data.id).then(response => {
        this.roleDetails = response.data
        const p = this.getPermissions()
        this.groupedPerms = groupBy(p, (c) => c.groupName)
        this.user_selected_perms = {
          permissions: [],
          roleID: data.id
        }
        this.user_selected_perms.permissions = this.roleDetails.permissions.map(e => e.id)
        this.user_selected_perms.roleID = data.id
        this.permsLoading = false
      }).catch(() => {
        this.permsLoading = false
        this.$message({
          message: 'Sorry, Something went wrong.',
          showClose: true,
          type: 'error'
        })
      })
    },
    loadPermissions() {
      this.$store.dispatch('roles/getPermissionsList').then(() => {
      })
    },
    getPermissions() {
      // this.permsLoading = this.isLoading
      const storePerms = this.getPerms
      if (storePerms === undefined) {
        this.$store.dispatch('roles/getPermissionsList').then(() => {
          // this.permsLoading = this.isLoading
        })
      }
      return this.getPerms
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleFilter() {

    },
    handleCreate() {
      this.roleForm = {
        name: '',
        description: '',
        code: ''
      }
      this.title = 'Add Role'
      this.actionType = 'create'
      this.showDialog = true
    },
    handleView(data) {
      this.title = 'Role'
      this.showDialog = true
      this.dialogData = data
      this.roleForm = data
      this.actionType = 'view'
    },
    handleEdit(data) {
      this.title = 'Edit Role'
      this.actionType = 'edit'
      this.showDialog = true
      this.roleForm = data
    },
    handleDeactivate() {

    },
    clearDialog() {
      this.title = ''
      this.showDialog = false
      this.dialogData = {}
      this.roleForm = {
        name: '',
        description: '',
        code: ''
      }
      this.submissionLoading = false
      this.showPermissions = false
      this.user_selected_perms = {
        permissions: [],
        roleID: 0
      }
    }
  }
}
</script>

<style scoped>

</style>
