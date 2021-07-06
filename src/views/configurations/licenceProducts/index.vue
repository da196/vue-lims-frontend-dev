<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        placeholder="Search by code, name or display name"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']"
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
        v-permission="['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']"
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
        v-permission="['ROLE_PRODUCT_SAVE']"
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
      v-permission="['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="50">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="95">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | globalStatusFilter">{{ scope.row.active === true ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Duration" align="center" width="100">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.duration }} Year(s)</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center" label="More" width="50">
        <template slot-scope="props">
          <p><b>License Category</b></p>
          <p> <b>Name:</b> {{ props.row.licenseCategory.displayName }}</p>
          <p> <b>Code:</b> {{ props.row.licenseCategory.displayName }}</p>
          <p><b>License Category Services</b></p>
          <p v-for="i in props.row.licenseCategory.services" :key="i.id"> <b>[{{ i.service.code }}]</b> {{ i.service.name }}  </p>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action" width="290rem">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']"
            plain
            size="mini"
            type="primary"
            icon="el-icon-view"
            :loading="viewRolesLoading"
            @click.prevent="handleView(scope.row)"
          >
            View
          </el-button>
          <el-button
            v-permission="['ROLE_PRODUCT_EDIT']"
            plain
            size="mini"
            type="warning"
            icon="el-icon-warning-outline"
            :loading="viewRolesLoading"
            @click.prevent="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_PRODUCT_DELETE']"
            plain
            size="mini"

            type="danger"
            icon="el-icon-delete"
            :loading="viewRolesLoading"
            @click="handleDeactivate(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <el-dialog :visible.sync="showProductLicence" :title="title" width="75%">
      <CreateProduct @closeDialog="closeProductLicence" />
    </el-dialog>
    <el-dialog :visible.sync="editProductLicence" :title="title" width="75%">
      <EditProduct :show-type="showType" :licence-product-in="editableLicenceProduct" @closeDialog="closeProductLicence" />
    </el-dialog>
  </div>
</template>

<script>
import {
  createLicenceProducts,
  deleteLicenceProduct,
  getLicenceProductsList
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { encodeHashId } from '@/utils'
import CreateProduct from '@/views/configurations/licenceProducts/createProduct'
import EditProduct from '@/views/configurations/licenceProducts/editProduct'
import pagination from '@/components/Pagination'
import { globalStatusFilter } from '@/filters'

export default {
  name: 'Index',
  components: { EditProduct, CreateProduct, pagination },
  filters: {
    globalStatusFilter
  },
  data() {
    return {
      showType: 'view',
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
      // listQuery.showClear: false,
      // Pagination
      page: {
        // size: 1,
        size: 10,
        totalElements: 9,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // --end pagination
      title: 'Add Licence Category',
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showProductLicence: false,
      editProductLicence: false,
      editableLicenceProduct: {},
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
    closeProductLicence(data) {
      this.showProductLicence = !data
      this.editProductLicence = !data
      if (this.showType !== 'view') {
        this.page.number = 0
        this.fetchData()
      }
    },
    fetchData() {
      this.listLoading = true
      getLicenceProductsList(this.page.number, this.page.size, this.listQuery.title)
        .then(response => {
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
        })
      // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.listLoading = false
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createLicenceProducts(this.licenceCategory).then(response => {
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
      this.showlicenceCategoryDialog = true
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
      const encodedId = encodeHashId(data.licenseCategory.parent)
      this.$router.push({ name: 'subItems', params: { subCategoryType: 'main-group', parentId: encodedId }})
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
    handleView(data) {
      this.$store.dispatch('licences/getLicenceProductByLicenceProductId', data)
      this.editableLicenceProduct = data
      this.showType = 'view'
      this.editableLicenceProduct.categoryID = data.licenseCategory.id
      this.editableLicenceProduct.feeStructure = data.feeStructures
      this.title = 'View Licence Product'
      this.editProductLicence = true
    },
    handleCreate() {
      this.showType = 'create'
      this.showProductLicence = true
      this.title = 'Create Licence Product'
    },
    clickLink(path) {
      this.$router.push({
        path,
        query: {
          // Ensure that each click, query is not the same
          // to ensure that refresh the view
          t: +new Date()
        }
      })
    },
    handleEdit(data) {
      this.$store.dispatch('licences/getLicenceProductByLicenceProductId', data)
      this.editableLicenceProduct = data
      this.showType = 'edit'
      this.editableLicenceProduct.categoryID = data.licenseCategory.id
      this.editableLicenceProduct.feeStructure = data.feeStructures
      this.title = 'Edit Licence Product'
      this.editProductLicence = true
    },
    handleDeactivate(data) {
      this.$confirm('This will permanently delete the licence product. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteLicenceProduct(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Licence product deleted successfully.',
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
    }
  }
}
</script>

<style scoped>

</style>
