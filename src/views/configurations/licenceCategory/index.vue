<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, code"
        style="width: 20rem"
        size="mini"
        class="filter-item"
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
        v-permission="['ROLE_LICENSE_CATEGORY_SAVE']"
        plain
        size="mini"

        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        Add
      </el-button></div>
    <el-table
      v-permission="['ROLE_LICENSE_CATEGORY_VIEW', 'ROLE_LICENSE_CATEGORY_VIEW_ALL']"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      size="mini"
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Licence Group" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Licence Display Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Licence Code" align="center" width="150rem">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Licence Description" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_LICENSE_CATEGORY_VIEW']"
            plain
            size="mini"
            type="success"
            :loading="viewRolesLoading"
            @click="getSubItems(scope.row)"
          >
            View SubItems
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showlicenceCategoryDialog" :title="title" width="50%">
      <el-form
        ref="licenceCategory"
        :model="licenceCategory"
        :rules="rules"
        label-width="140px"
        label-position="top"
      >

        <el-form-item label="Licence Category Name" prop="name" required>
          <el-input v-model="licenceCategory.name" />
        </el-form-item>
        <el-form-item label="Licence Category Display Name" prop="name" required>
          <el-input v-model="licenceCategory.displayName" />
        </el-form-item>
        <el-form-item label="Licence Category Code" prop="code" required>
          <el-input v-model="licenceCategory.code" />
        </el-form-item>

        <el-form-item label="Description" prop="description" required>
          <el-input v-model="licenceCategory.description" type="textarea" />
        </el-form-item>
        <!--        <el-select-->
        <!--          v-model="value"-->
        <!--          placeholder="Select"-->
        <!--          :remote-method="remoteMethod"-->
        <!--          :loading="loadingSelect"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="item in options"-->
        <!--            :key="item.value"-->
        <!--            :label="item.label"-->
        <!--            :value="item.value"-->
        <!--          />-->
        <!--        </el-select>-->
        <el-form-item>
          <el-button
            plain
            size="mini"
            type="primary"
            @click="submitForm('licenceCategory')"
          >Create
          </el-button>
          <el-button
            plain
            size="mini"
            @click="resetForm('licenceCategory')"
          >Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { createLicenceCategory, getListOfLicenseCategories } from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { encodeHashId } from '@/utils'

export default {
  name: 'Index',
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
      title: 'Add Licence Category',
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showlicenceCategoryDialog: false,
      licenceCategory: {
        name: '',
        code: '',
        description: '',
        displayName: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Licence Category name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        displayName: [
          {
            required: true,
            message: 'Please input Licence Category Display Name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: 'Please input Licence Category Code',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        description: [
          {
            required: true,
            message: 'Please input Licence Category Description',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getListOfLicenseCategories('root', 0).then(response => {
        this.list = response.data
        this.listLoading = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.licenceCategory.parentId = 0
          this.licenceCategory.services = []
          this.licenceCategory.flag = 'ROOT'
          createLicenceCategory(this.licenceCategory).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Licence Category created successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('licenceCategory')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('licenceCategory')
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
      this.showlicenceCategoryDialog = false
      this.licenceCategory = {
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
      this.$router.push({ name: 'subItems', params: { subCategoryType: 'root', parentId: encodedId }})
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
      this.title = 'Add Licence Category'
      this.showlicenceCategoryDialog = true
      this.licenceCategory = {}
      console.log('handling create')
    }

  }
}
</script>

<style scoped>

</style>
