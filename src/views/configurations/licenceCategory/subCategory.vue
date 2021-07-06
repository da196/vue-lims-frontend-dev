<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_LICENSE_CATEGORY_VIEW', 'ROLE_LICENSE_CATEGORY_VIEW_ALL']"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_LICENSE_CATEGORY_VIEW', 'ROLE_LICENSE_CATEGORY_VIEW_ALL']"
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
      v-loading="listLoading"
      v-permission="['ROLE_LICENSE_CATEGORY_VIEW', 'ROLE_LICENSE_CATEGORY_VIEW_ALL']"
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
      <el-table-column label="Licence Group">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Licence Code" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Display Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Licence Description">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!hasChildren" type="expand" label="Services" align="center" width="110">
        <template slot-scope="props">
          <p><b>Services</b></p>
          <p v-for="i in props.row.services" :key="i.id"> <b>[{{ i.code }}]</b> {{ i.name }}  </p>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action" :width=" !hasChildren ? '180rem': '300rem'">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.flag !== 'LEAF'"
            v-permission="['ROLE_LICENSE_CATEGORY_VIEW']"
            plain
            size="mini"
            type="success"
            :loading="viewRolesLoading"
            @click="getSubItems(scope.row)"
          >
            View SubItems
          </el-button>
          <el-button
            v-permission="['ROLE_LICENSE_CATEGORY_EDIT']"
            plain
            size="mini"
            type="warning"
            :loading="viewRolesLoading"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_LICENSE_CATEGORY_DELETE']"
            plain
            size="mini"
            type="danger"
            @click="handleDeactivate(scope.row)"
          > Deactivate </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-button
        plain
        size="mini"
        style="float: right; margin: 20px"
        type="primary"
        icon="el-icon-back"
        @click.prevent="$router.back()"
      >  Back</el-button>
    </el-row>
    <el-dialog :visible.sync="showLicenceCategoryDialog" :title="title" width="50%">
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
        <el-form-item label="Category Group " prop="flag" required>
          <el-select
            v-model="licenceCategory.flag"
            filterable
            placeholder="Select Licence Category Group"
            style="min-width: 30vw"
          >
            <el-option
              v-for="item in licenceCategoryGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Description" prop="description" required>
          <el-input v-model="licenceCategory.description" type="textarea" />
        </el-form-item>
        <el-form-item v-if="licenceCategory.flag ==='LEAF'" label="Licence Services" prop="licenceServices">
          <el-select
            v-model="licenceServiceModel"
            multiple
            collapse-tags
            filterable
            placeholder="Select Licence Service"
            style="min-width: 30vw"
          >
            <el-option
              v-for="item in licenceServicesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="!isEdit">
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
        <el-form-item v-if="isEdit">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="submitFormEdit('licenceCategory')"
          >Edit
          </el-button>
          <el-button
            plain
            size="mini"
            @click.prevent="showLicenceCategoryDialog = !showLicenceCategoryDialog"
          >Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  createLicenceCategory, deactivateLicenceCategory, getAllLicenceDetailsList,
  getListOfLicenseCategories,
  updateLicenceCategory
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { decodeHashId, encodeHashId } from '@/utils'

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
      showLicenceCategoryDialog: false,
      licenceCategory: {
        name: '',
        code: '',
        description: '',
        displayName: '',
        parentId: 0,
        services: [],
        flag: ''
      },
      licenceCategoryGroupList: [
        { id: 'BRANCH', name: 'Branch' },
        { id: 'LEAF', name: 'Leaf' }
      ],
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
        flag: [{ required: true, message: 'Please enter the category Group', trigger: 'blur' }],
        description: [
          {
            required: true,
            message: 'Please input Licence Category Description',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      },
      previousCategoryType: 'root',
      subCategoryType: 'level-1',
      parentId: 0,
      hasChildren: true,
      licenceServicesList: [],
      isEdit: false,
      licenceServiceModel: []
    }
  },
  computed: {
    // this.newSubCategory =
  },
  created() {
    this.previousCategoryType = this.$route.params.subCategoryType
    this.parentId = decodeHashId(this.$route.params.parentId)[0]
    this.fetchData()
    this.identifyLocation()
    this.getLicenceServices()
  },
  methods: {
    getLicenceServices() {
      this.listLoading = true
      getAllLicenceDetailsList(0, 1000).then(response => {
        this.licenceServicesList = response.data.content
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.licenceServicesList = []
        // this.listLoading = false
      })
    },
    identifyLocation() {
      switch (this.previousCategoryType) {
        case 'root':
          this.subCategoryType = 'level-1'
          break
        case 'level-1':
          this.subCategoryType = 'level-2'
          break
        case 'level-2':
          this.subCategoryType = 'level-3'
          break
        case 'level-3':
          this.subCategoryType = 'level-4'
          break
        default:
          this.subCategoryType = 'level-1'
      }
    },
    fetchData() {
      this.listLoading = true
      getListOfLicenseCategories('', this.parentId).then(response => {
        this.list = response.data
        this.listLoading = false
        if (this.list?.length > 0 && this.list[0].flag === 'LEAF') {
          this.hasChildren = false
        } else {
          this.hasChildren = true
        }

        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.listLoading = false
        this.hasChildren = false
      })
    },
    /**
     * @param {string|number} formName
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.licenceCategory.parentId = this.parentId
          this.licenceCategory.services = this.licenceServiceModel
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
    /**
     * @param {string|number} formName
     */
    submitFormEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const updateForm =
          {
            id: this.licenceCategory.id,
            code: this.licenceCategory.code,
            name: this.licenceCategory.name,
            displayName: this.licenceCategory.displayName,
            description: this.licenceCategory.description,
            parentId: this.parentId,
            flag: this.licenceCategory.flag
          }
          if (!this.hasChildren || this.licenceServiceModel.length > 0) {
            updateForm.services = this.licenceServiceModel
          } else {
            updateForm.services = []
          }
          updateLicenceCategory(updateForm).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Licence Category updated successfully.',
                showClose: true,
                type: 'success'
              })
              this.clearDialog()
              this.resetForm('licenceCategory')
              this.fetchData()
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
    /**
     * @param {string|number} formName
     */
    resetForm(formName) {
      this.$refs[formName]?.resetFields()
    },
    /**
     * @param {number} data
     * @abstract view subitems of the data
     */
    getSubItems(data) {
      const encodedId = encodeHashId(data.id)
      this.$router.push({ name: 'subItems', params: { subCategoryType: this.subCategoryType, parentId: encodedId }})
    },
    clearDialog() {
      this.showLicenceCategoryDialog = false
      this.licenceCategory = {
        name: '',
        code: '',
        description: ''
      }
    },
    handleFilter() {
      console.log('handle filter')
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently delete the licence Category. If it is in use, an error will occur. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deactivateLicenceCategory(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Licence category deleted successfully.',
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
    handleEdit(data) {
      this.title = 'Edit Licence Sub-Category'
      this.showLicenceCategoryDialog = true
      this.licenceCategory = data
      this.licenceServiceModel = data.services.map(e => e.id)
      this.isEdit = true
    },
    handleCreate() {
      this.isEdit = false
      this.title = 'Add Licence Sub-Category'
      this.showLicenceCategoryDialog = true
      this.licenceCategory = {}
      this.resetForm('licenceCategory')
    }

  }
}
</script>

<style scoped>

</style>
