<template>
  <div class="app-container">
    <!-- Start Top Search and Add Button -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_FEE_STRUCTURE_VIEW','ROLE_FEE_STRUCTURE_VIEW_ALL']"
        placeholder="Search ..."
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_FEE_STRUCTURE_VIEW','ROLE_FEE_STRUCTURE_VIEW_ALL']"
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
        v-permission="['ROLE_FEE_STRUCTURE_VIEW','ROLE_FEE_STRUCTURE_VIEW_ALL']"
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
        v-permission="['ROLE_FEE_STRUCTURE_CREATE']"
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
      v-loading="listLoading"
      v-permission="['ROLE_FEE_STRUCTURE_VIEW', 'ROLE_FEE_STRUCTURE_VIEW_ALL']"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="90rem">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="90rem">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active | globalStatusFilter">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="GFS Code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Fee Type" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.feeType.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Fee Amount" align="right" width="100rem">
        <template slot-scope="scope">
          <span> {{ scope.row.feeAmount | toThousandFilter }} <b>{{ scope.row.feeCurrency.code }}</b> </span>
        </template>
      </el-table-column>
      <el-table-column label="Period" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Applicable State" align="left" width="200rem">
        <template slot-scope="scope">
          <span>{{ scope.row.applicableState }}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center" label="More" width="50rem">
        <template slot-scope="props">
          <p><b>Percentage:</b> {{ props.row.feePercent * 100 }} %</p>
          <p><b>Date Created:</b> {{ props.row.createdAt | datetimeFilter }}</p>
          <p><b>Account Code:</b> {{ props.row.accountCode }}</p>
          <p><b>GFS Code:</b> {{ props.row.code }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action" width="200rem">
        <template slot-scope="scope">
          <el-tooltip content="Edit" placement="top">
            <el-button
              :id="scope.row.id"
              v-permission="['ROLE_FEE_STRUCTURE_EDIT']"
              plain
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>

          <el-tooltip
            v-if="scope.row.active"
            content="Deactivate"
            placement="top"
          >
            <el-button
              plain
              size="mini"
              type="danger"
              icon="el-icon-video-pause"
              @click="handleDeactivate(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            v-else-if="! scope.row.active"
            content="Deactivate"
            placement="top"
          >
            <el-button
              v-permission="['ROLE_FEE_STRUCTURE_EDIT']"
              plain
              size="mini"
              type="primary"
              icon="el-icon-video-play"
              @click="handleDeactivate(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <!-- End Table -->

    <pagination
      v-permission="['ROLE_FEE_STRUCTURE_VIEW','ROLE_FEE_STRUCTURE_VIEW_ALL']"
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <!-- Start Dialog -->
    <el-dialog :visible.sync="showDialog" :title="title" style="padding:20px 5px">
      <!-- start -->
      <el-form
        ref="licenceFeeStructureForm"
        :model="licenceFeeStructureForm"
        :rules="licenceFeeStructureRules"
        class="demo-ruleForm"
        size="mini"
        label-width="150px"
      >

        <el-form-item label="Name" prop="name">
          <el-input v-model="licenceFeeStructureForm.name" style="width:400px;" />
        </el-form-item>

        <el-form-item label="Applicable State" prop="applicableState">
          <el-select v-model="licenceFeeStructureForm.applicableState" style="width:400px;" placeholder="Please select your type">
            <el-option label="APPLICATION" value="APPLICATION" />
            <el-option label="INITIAL_PAYMENT" value="INITIAL_PAYMENT" />
            <el-option label="LICENSE_EXPIRED" value="LICENSE_EXPIRED" />
            <el-option label="ACCOUNT_INITIATION" value="ACCOUNT_INITIATION" />
            <el-option label="UNCHARGABLE" value="UNCHARGABLE" />
            <el-option label="LICENSERENEWAL" value="LICENSERENEWAL" />
            <el-option label="CONSTRUCTIONPERMIT" value="CONSTRUCTIONPERMIT" />
          </el-select>
        </el-form-item>

        <el-form-item label="Amount" prop="feeAmount">
          <el-input v-model="licenceFeeStructureForm.feeAmount" type="number" style="width:400px;" />
        </el-form-item>

        <el-form-item label="Currency" prop="feeCurrency">
          <el-select v-model="licenceFeeStructureForm.feeCurrency" size="mini" style="width:400px;" placeholder="Please select your currency ">
            <el-option v-for="cur in list_currencies" :key="cur.id" :label="cur.name" :value="cur.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Percent" prop="feePercent">
          <el-input v-model="licenceFeeStructureForm.feePercent" type="number" style="width:400px;" />
        </el-form-item>

        <el-form-item label=" Frequency" prop="frequency">
          <el-input v-model="licenceFeeStructureForm.frequency" type="number" style="width:400px;" />
        </el-form-item>

        <el-form-item label=" Period" prop="period">
          <el-select v-model="licenceFeeStructureForm.period" style="width:400px;" placeholder="-- Select your period --">
            <el-option label="DAILY" value="DAILY" />
            <el-option label="WEEKLY" value="WEEKLY" />
            <el-option label="MONTHLY" value="MONTHLY" />
            <el-option label="QUARTERLY" value="QUARTERLY" />
            <el-option label="YEARLY" value="YEARLY" />
            <el-option label="ONCE" value="ONCE" />
          </el-select>
        </el-form-item>

        <el-form-item label="Account Code" prop="accountCode">
          <el-input v-model="licenceFeeStructureForm.accountCode" style="width:400px;" />
        </el-form-item>

        <el-form-item label="GFS Code" prop="code">
          <el-input v-model="licenceFeeStructureForm.code" style="width:400px;" />
        </el-form-item>

        <el-form-item label="Fee Type" prop="feeType">
          <el-select v-model="licenceFeeStructureForm.feeType" size="mini" style="width:400px;" placeholder="-- Select your feeType -- ">
            <el-option v-for="cur in list_feeType" :key="cur.id" :label="cur.name" :value="cur.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Fee AbleType" prop="feeableType">
          <el-select v-model="licenceFeeStructureForm.feeableType" size="mini" style="width:400px;" placeholder="-- Select your feeType -- " @change="onChange()">
            <el-option label="LICENSE" value="LICENSE" />
            <el-option label="LICENSE_PRODUCT" value="LICENSE_PRODUCT" />
            <el-option label="ENTITY" value="ENTITY" />
            <el-option label="ENTITY_PRODUCT" value="ENTITY_PRODUCT" />
          </el-select>
        </el-form-item>

        <el-form-item label="Licence/Entity" prop="feableId">
          <el-select v-model="licenceFeeStructureForm.feableId" size="mini" style="width:400px;" placeholder="-- Select your feeType -- ">

            <template v-if="licenceFeeStructureForm.feeableType ==='LICENSE'">
              <el-option v-for="fee in list_feeId" :key="fee.id" :label="fee.newObject" :value="fee.id" />
            </template>

            <template v-else-if="licenceFeeStructureForm.feeableType ==='ENTITY'">
              <el-option v-for="feeAble in list_feeId" :key="feeAble.id" :label="feeAble.name" :value="feeAble.id" />
            </template>

            <template v-else>
              <el-option label="No data" value="0" />
            </template>

          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="actionType === 'create'"
            v-permission="['ROLE_FEE_STRUCTURE_CREATE']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormCreate('licenceFeeStructureForm')"
          >Create</el-button>
          <el-button
            v-if="actionType === 'create'"
            plain
            size="mini"
            @click="resetForm('licenceFeeStructureForm')"
          >Reset</el-button>
          <el-button
            v-if="actionType === 'edit'"
            v-permission="['ROLE_FEE_STRUCTURE_EDIT']"
            plain
            size="mini"
            type="primary"
            :loading="submissionLoading"
            @click="submitFormEdit('licenceFeeStructureForm')"
          >Edit</el-button>
          <el-button
            v-if="actionType === 'delete'"
            plain
            size="mini"
            type="danger"
            :loading="submissionLoading"
            @click="handleCreate('licenceFeeStructureForm')"
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
import { getAllLicenceFeeStructureList, createLicenceFeeStructure, updateLicenceFeeStructure,
  deleteLicenceFeeStructure, getListOfValueByType } from '@/api/configurations'
import {
  getListLicenceswithStatus
} from '@/api/dashboard'
import pagination from '@/components/Pagination'
import { getActiveEntityPageable } from '@/api/licences'
import { globalStatusFilter, toThousandFilter, datetimeFilter } from '@/filters'

export default {
  filters: {
    datetimeFilter,
    globalStatusFilter,
    toThousandFilter
  },
  components: {
    pagination
  },
  data() {
    return {
      // Pagination
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // --end pagination
      list: null,
      listLoading: true,
      viewItemLoading: false,
      list_currencies: [],
      list_feeType: [],
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
      title: 'Add Licence Fee Structure',
      multipleSelection: [],
      licenceFeeStructureRules: {
        applicableState: [{ required: true, message: 'Please enter the applicable state', trigger: 'blur' }],
        name: [{ required: true, message: 'Please enter the name', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the GFS code', trigger: 'blur' }],
        accountCode: [{ required: true, message: 'Please enter the Account code', trigger: 'blur' }],
        feeAmount: [{ required: true, message: 'Please enter Amount', trigger: 'blur' }],
        feeType: [{ required: true, message: 'Please enter the Licence Fee Type', trigger: 'blur' }],
        feeableType: [{ required: true, message: 'Please enter the Licence Fee Able Type', trigger: 'blur' }],
        feableId: [{ required: true, message: 'Please select Licence or Entity', trigger: 'blur' }],
        feeCurrency: [{ required: true, message: 'Please enter the licence fee structure currency', trigger: 'blur' }],
        feePercent: [{ required: true, message: 'Please enter the licence fee structure percent', trigger: 'blur' }],
        frequency: [{ required: true, message: 'Please enter the licence fee structure frequency', trigger: 'blur' }],
        period: [{ required: true, message: 'Please enter the licence fee structure period', trigger: 'blur' }]
      },
      licenceFeeStructureForm: {
        applicableState: '',
        name: '',
        code: '',
        feeAmount: 0,
        feeCurrency: '',
        feePercent: 0,
        frequency: 0,
        period: '',
        accountCode: '',
        feeType: '',
        feeableType: '',
        feableId: 0
      },
      submissionLoading: false,
      actionType: 'create',
      list_feeId: []
    }
  },
  computed: {

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
    onChange() {
      const selectValue = this.licenceFeeStructureForm.feeableType
      if (selectValue === 'LICENSE') {
        // SEARCH BY LICENSE
        getListLicenceswithStatus('').then(response => {
          this.list_feeId = response.data.content
          const myArray = this.list_feeId
          this.list_feeId = myArray.map(item => { item.newObject = item.applicantEntityName + ' -  (' + item.applicationNumber + ')'; return item })
          this.listLoading = false
        }).catch(() => {
          this.list_feeId = []
          this.listLoading = false
        })
      } else if (selectValue === 'ENTITY') {
        // SEARCH BY ENTITY
        getActiveEntityPageable(0, 1000, '').then(response => {
          this.list_feeId = response.data.content
          console.log(this.list_feeId)
          this.listLoading = false
        }).catch(() => {
          this.list_feeId = []
          this.listLoading = false
        })
      } else {
        this.list_feeId = []
      }
    },
    fetchData() {
      this.listLoading = true
      getAllLicenceFeeStructureList(this.page.number, this.page.size, this.listQuery.title).then((response) => {
        this.listLoading = false
        this.list = response.data.content
        if (response.data) {
          this.filterPageData(response.data.page)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.list = []
        this.listLoading = false
      })

      // GET CURRENCY ONLY
      getListOfValueByType('CURRENCY').then(response => {
        this.list_currencies = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list_currencies = []
        this.listLoading = false
      })

      // GET FEE TYPE
      getListOfValueByType('FEETYPE').then(response => {
        this.list_feeType = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list_feeType = []
        this.listLoading = false
      })
    },
    // Submit create FROM API
    submitFormCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submissionLoading = true
          createLicenceFeeStructure(this.licenceFeeStructureForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Licence Fee Structure was saved successfully.',
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
            accountCode: this.licenceFeeStructureForm.accountCode,
            applicableState: this.licenceFeeStructureForm.applicableState,
            code: this.licenceFeeStructureForm.code,
            feableId: this.licenceFeeStructureForm.feableId,
            feeAmount: this.licenceFeeStructureForm.feeAmount,
            feeCurrency: this.licenceFeeStructureForm.feeCurrency,
            feePercent: this.licenceFeeStructureForm.feePercent,
            feeType: this.licenceFeeStructureForm.feeType,
            feeableType: this.licenceFeeStructureForm.feeableType,
            frequency: this.licenceFeeStructureForm.frequency,
            name: this.licenceFeeStructureForm.name,
            feePeriod: this.licenceFeeStructureForm.feePeriod,
            id: this.licenceFeeStructureForm.id
          }
          updateLicenceFeeStructure(submissionForm).then((response) => {
            this.fetchData()
            this.clearDialog()
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Licence Fee Structure edited successfully.',
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
      this.licenceFeeStructureForm = {}
      this.submissionLoading = false
      this.resetForm('licenceFeeStructureForm')
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
      this.title = 'Add Licence Fee Structure'
      this.actionType = 'create'
      this.showDialog = true
      this.dialogData = {}
    },
    handleView(data) {
      this.title = 'Licence Fee Structure'
      this.showDialog = true
      this.dialogData = data
    },
    handleEdit(data) {
      console.log('QO')
      console.log(data)
      this.title = 'Edit Licence Fee Structure'
      this.actionType = 'edit'
      this.showDialog = true
      this.dialogData = data
      this.licenceFeeStructureForm = data
    },
    handleDeactivate(data) {
      this.$confirm('This Licence Fee Structure will be deactivated. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteLicenceFeeStructure(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Licence Fee Structure deactivated successfully.',
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
