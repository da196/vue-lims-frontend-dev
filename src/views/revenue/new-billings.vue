<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, code"
        style="width: 20rem"
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
        v-if="listQuery.showClear"
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
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleBill()"
      >
        Create Bill
      </el-button>

      <!--<download-csv
        :data="jsonData"
        :name="dataFile"
        :labels="labels"
        :fields="fields"
        @export-finished="exported"
      >
        <el-button>Download</el-button>
      </download-csv>-->

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
    >
      <el-table-column type="expand" label="..." align="center" width="120">
        <template slot-scope="scope">
          <p><b>Purpose of the Bill:</b></p>
          <div>
            <p />
          </div>
          <p v-for="(i, index) in scope.row.fees" :key="i.id">
            {{ index +1 }}. {{ i.feeType }} - {{ i.amount }} {{ i.billing.currency !== null ? i.billing.currency.name :'N/A' }}
          </p>
        </template>
      </el-table-column>

      <el-table-column label="Licencee" align="center">
        <template slot-scope="{row}">
          <span>{{ row.licence !== null ? row.licence.applicant.name :'N.A' }}  </span>
        </template>
      </el-table-column>
      <el-table-column label="Billing Number" align="center">
        <template slot-scope="{row}">
          <span>{{ row.billing ? row.billing.billingNumber : 'N/A' }}  </span>
        </template>
      </el-table-column>
      <el-table-column label="Payment" align="center">
        <template slot-scope="scope">
          <span size="mini"><b>Required to Pay:</b> {{ scope.row.billing.amount }} {{ scope.row.billing.currency !== null ? scope.row.billing.currency.name : 'N/A' }}</span><br>
          <span size="mini"><b>Pending to Pay:</b>  {{ scope.row.billing.amountPending }} {{ scope.row.billing.currency !== null ? scope.row.billing.currency.name : 'N/A' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Control Number" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billing.controlNumber }}</span><br>
          <span v-if="scope.row.billing.status === 'PENDING'"><i size="mini"><b>Expired Date :</b></i> {{ scope.row.billing.expireDate }}</span>
          <span v-else><i size="mini"><b>No Control Number</b></i></span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.billing.status | statusFilter">{{ scope.row.billing.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Created At" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billing.createdAt }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <el-dialog :visible.sync="showBillingDialog" :title="title" width="60%">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="Create Bill" />
        <el-step title="Add Licence Fee" />
      </el-steps>
      <div v-if="activeStep === 1">
        <el-form
          ref="billingProduct"
          :model="billingProduct"
          :rules="billingProductRules"
          label-width="210px"
          label-position="left"
        >

          <el-form-item label="Bill For" prop="billable" required>
            <el-select v-model="billingProduct.billable" style="width:300px;" placeholder="-- Select Billing For --" @change="onChange()">
              <el-option label="LICENCE" value="LICENCE" />
              <el-option label="ENTITY" value="ENTITY" />
            </el-select>
          </el-form-item>

          <el-form-item label="Licence/Entity" prop="licence_id" required>
            <el-select v-model="billingProduct.licence_id" size="mini" style="width:300px;" placeholder="-- Select Licence/Entity -- ">

              <template v-if="billingProduct.billable ==='LICENCE'">
                <el-option v-for="fee in list_feeId" :key="fee.id" :label="fee.newObject" :value="fee.id" />
              </template>

              <template v-else-if="billingProduct.billable ==='ENTITY'">
                <el-option v-for="feeAble in list_feeId" :key="feeAble.id" :label="feeAble.name" :value="feeAble.id" />
              </template>

              <template v-else>
                <el-option label="No data" value="0" />
              </template>

            </el-select>
          </el-form-item>

          <el-form-item label="Currency Name" prop="currency_id" required>
            <el-select v-model="billingProduct.currency_id" style="width:300px;" placeholder="-- Select Currency --">
              <template v-for="currency in list_currencies">
                <el-option :key="currency.id" :label="currency.name" :value="currency.id" />
              </template>
            </el-select>
          </el-form-item>

          <el-form-item label="Expire days" prop="expire_days" required>
            <el-input v-model="billingProduct.expire_days" type="number" style="width:300px;" />
          </el-form-item>

          <el-form-item label="Payment Mode" prop="payment_mode" required>
            <el-select v-model="billingProduct.payment_mode" style="width:300px;" placeholder="-- Select Payment Mode --">
              <el-option label="Full Bill" value="1" />
              <el-option label="Partial Bill" value="2" />
              <el-option label="Exactly Bill" value="3" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activeStep === 2">
        <el-row :gutter="10">
          <el-col :sm="24" :md="10">
            <el-form
              ref="feeStructure"
              :model="standAloneFeeStructure"
              :rules="standAloneFeeStructureRules"
              label-width="140px"
              label-position="left"
              size="small"
            >

              <el-form-item label="Fee" prop="fee_id" required>
                <el-select v-model="standAloneFeeStructure.fee_id" placeholder="-- Select Licence Fee --" style="width:300px;" @change="makeChanges($event)">
                  <template v-for="fee in list_fees">
                    <el-option :key="fee.id" :label="fee.name" :value="fee.id" />
                  </template>
                </el-select>
              </el-form-item>

              <el-form-item label="Amount" prop="amount" required>
                <el-input v-model="standAloneFeeStructure.amount" style="width:300px;" :disabled="enableAmount" />
              </el-form-item>

              <el-form-item>
                <el-button
                  plain
                  size="mini"
                  icon="el-icon-plus"
                  type="primary"
                  @click.prevent="addFeeStructureToList"
                >
                  Add Licence Fee
                </el-button>
              </el-form-item>

            </el-form>
          </el-col>
          <el-col :sm="24" :md="14">
            <h4 style="text-align: center">Licence Fee </h4>
            <el-table fit highlight-current-row border size="small" :data="billingProduct.fees_">

              <el-table-column label="Fee Name" sortable align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Amount" sortable align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.amount }}</span>
                </template>
              </el-table-column>

              <el-table-column label="Action" align="center">
                <template slot-scope="scope">
                  <el-button
                    plain
                    size="mini"
                    type="danger"
                    @click.prevent="deleteFeeStructure(scope.row)"
                  > Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-button
          v-if="activeStep!==1"
          plain
          size="mini"
          icon="el-icon-arrow-left"
          :disabled="loadingSave"
          @click.prevent="activeStep-=1"
        >
          Previous
        </el-button>
        <el-button
          v-if="activeStep !== 3"
          plain
          size="mini"
          icon="el-icon-arrow-right"
          :disabled="loadingSave"
          @click.prevent="validateFormAndContinue"
        >
          Next
        </el-button>
        <el-button
          v-if="activeStep===2"
          plain
          size="mini"
          style="float: right"
          :disabled="loadingSave"
          :loading="loadingSave"
          type="success"
          @click.prevent="submitBillingProduct"
        >
          Save
        </el-button>
        <el-button
          plain
          size="mini"
          style="float: right"
          type="warning"
          @click="closeDialog"
        >
          Cancel
        </el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
// import JsonCSV from '@/JsonCSV.vue'

import { mapGetters } from 'vuex'
import { getAllBillings, createNewBilling } from '@/api/billings'
import { statusCodes } from '@/utils/status-codes'
import pagination from '@/components/Pagination'
import { getListLicenceswithStatus } from '@/api/dashboard'
import { getActiveEntityPageable, getListFeeswithFeeableType, getLicenceFeeStructure } from '@/api/licences'
import { getListOfValueByType } from '@/api/configurations'

export default {
  components: {
    pagination
    // 'download-csv': JsonCSV
  },
  filters: {
    datetimeFilter(status) {
      var d = new Date(status)
      return d.toLocaleDateString()
      // return d.toGMTString()
    },
    statusFilter(status) {
      const statusMap = {
        'PAID': 'success',
        'PENDING': 'warning',
        'BILLED': '',
        'NOTPAID': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      enableAmount: true,
      list: [],
      listLoading: true,
      userRoles: [],
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
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // --end pagination
      downloadLoading: false,
      addClient: false,

      // start handle bill
      list_fees: [],
      title: 'Create Bill',
      list_currencies: [],
      list_feeId: [],
      showBillingDialog: false,
      activeStep: 1,
      standAloneFeeStructure: {
        fee_id: '',
        amount: 0
      },
      standAloneFeeStructureRules: {
        fee_id: [{ required: true, message: 'Please select licence fee structure', trigger: 'blur' }],
        amount: [{ required: true, message: 'Please type amount', trigger: 'blur' }]
      },
      billingProduct: {
        billable: '',
        currency_id: '',
        expire_days: 0,
        fees: [],
        licence_id: '',
        payment_mode: '',

        fees_: []
      },
      billingProductRules: {
        billable: [{ required: true, message: 'Please select Billable', trigger: 'blur' }],
        licence_id: [{ required: true, message: 'Please select Licence/Entity', trigger: 'blur' }],
        currency_id: [{ required: true, message: 'Please select Currency', trigger: 'blur' }],
        expire_days: [{ required: true, message: 'Please input Expire Days', trigger: 'blur' }],
        payment_mode: [{ required: true, message: 'Please select Payment Mode', trigger: 'blur' }]
      },
      formValid: false,
      loadingSave: false,
      standAloneFeeStructure_: {
        amount: 0,
        fee_id: '',
        name: ''
      },
      // end handle bill

      // csv-new
      jsonData: [
        { 'id': 1, 'fname': 'Jesse', 'lname': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male', 'phone': { 'landline': '25590', 'mainland': '12344' }},
        { 'id': 2, 'fname': 'John', 'lname': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male', 'phone': { 'landline': '12390', 'mainland': '00044' }}

      ],
      dataFile: 'my_export.csv',
      labels: {
        fname: 'First Name',
        lname: 'Last Name'
      },
      fields: ['id', 'lname', 'phone.mainland', 'fname'],
      isExported: false
    }
  },
  computed: {
    ...mapGetters('client', ['GetClientResponse']),
    hasCargoSelection: function() {
      return this.multipleSelection.length !== 0
    },

    // csv-new
    readableJson: function() {
      const self = this
      self.list
      return JSON.stringify(self.list, null, 2)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // csv-new
    exported(event) {
      this.isExported = true
      setTimeout(() => {
        this.isExported = false
      }, 3 * 1000)
    },

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
    makeChanges(event) {
      getLicenceFeeStructure(this.standAloneFeeStructure.fee_id).then(response => {
        if (response.data.applicableState === 'ACCOUNT_INITIATION') {
          // enable amount field
          this.enableAmount = false
          // this.standAloneFeeStructure.amount = response.data.feeAmount
          this.standAloneFeeStructure.fee_id = response.data.id

          // display
          // this.standAloneFeeStructure_.amount = this.standAloneFeeStructure.amount
          this.standAloneFeeStructure_.fee_id = response.data.id
          this.standAloneFeeStructure_.name = response.data.name
        } else {
          this.enableAmount = true
          this.standAloneFeeStructure.amount = response.data.feeAmount
          this.standAloneFeeStructure.fee_id = response.data.id

          // display
          this.standAloneFeeStructure_.amount = response.data.feeAmount
          this.standAloneFeeStructure_.fee_id = response.data.id
          this.standAloneFeeStructure_.name = response.data.name
          // disable amount field
        }
      }).catch(e => {
        this.$message({
          message: 'Sorry, Something went wrong while retrieving licence fee structure',
          showClose: true,
          type: 'error'
        })
      })
    },
    addFeeStructureToList() {
      this.$refs['feeStructure'].validate((valid) => {
        if (valid) {
          this.standAloneFeeStructure_ = {
            fee_id: this.standAloneFeeStructure_.fee_id,
            amount: this.standAloneFeeStructure.amount,
            name: this.standAloneFeeStructure_.name
          }
          this.billingProduct.fees.push(this.standAloneFeeStructure)
          this.billingProduct.fees_.push(this.standAloneFeeStructure_)
          this.standAloneFeeStructure = {
            amount: 0,
            fee_id: ''
          }

          this.standAloneFeeStructure_ = {
            amount: 0,
            fee_id: '',
            name: ''
          }
        } else {
          return false
        }
      })
    },
    onChange() {
      const selectValue = this.billingProduct.billable
      if (selectValue === 'LICENCE') {
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

        // SEARCH FOR LIST_FEES
        getListFeeswithFeeableType('LICENSE').then((response) => {
          this.list_fees = response.data
        }).catch(() => {
          this.list_fees = []
        })
      } else if (selectValue === 'ENTITY') {
        // SEARCH BY ENTITY
        getActiveEntityPageable(0, 1000, '').then(response => {
          this.list_feeId = response.data.content
          this.listLoading = false
        }).catch(() => {
          this.list_feeId = []
          this.listLoading = false
        })

        // SEARCH FOR LIST_FEES
        getListFeeswithFeeableType('ENTITY').then((response) => {
          this.list_fees = response.data
        }).catch(() => {
          this.list_fees = []
        })
      } else {
        this.list_feeId = []
      }
    },
    fetchData() {
      this.listLoading = true
      getAllBillings(this.page.number, this.page.size, this.listQuery.title).then((response) => {
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
          const test = JSON.stringify(this.list)
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

      // GET CURRENCY ONLY
      getListOfValueByType('CURRENCY').then(response => {
        this.list_currencies = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list_currencies = []
        this.listLoading = false
      })
    },
    validateFormAndContinue() {
      if (this.activeStep === 1) {
        this.$refs.billingProduct.validate((valid) => {
          if (valid) {
            this.formValid = true
            this.activeStep += 1
          } else {
            this.formValid = false
          }
        })
      } else if (this.activeStep === 2) {
        this.$refs.feeStructure.validate((valid) => {
          if (valid || this.billing.fees.length > 0) {
            this.formValid = true
            this.activeStep += 1
          } else {
            this.formValid = false
          }
        })
      }
    },
    submitBillingProduct() {
      this.loadingSave = true
      // TODO -- RETURN IT BACK
      // Remove name attribute....
      this.billingProduct.fees_.forEach(function(item) { delete item.name })

      this.billingProduct = {
        billable: this.billingProduct.billable,
        currency_id: this.billingProduct.currency_id,
        expire_days: this.billingProduct.expire_days,
        fees: this.billingProduct.fees_,
        licence_id: this.billingProduct.licence_id,
        payment_mode: this.billingProduct.payment_mode
      }
      // debugger
      createNewBilling(this.billingProduct).then(response => {
        this.loadingSave = false
        if (response.code === statusCodes.SUCCESS) {
          this.$message({
            message: 'Bill was created successfully.',
            showClose: true,
            type: 'success'
          })
          this.closeDialog()
        }
      }).catch(e => {
        this.loadingSave = false
        this.$message({
          message: 'Sorry, Something went wrong.',
          showClose: true,
          type: 'error'
        })
        this.closeDialog()
      })
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
    },
    handleCreate() {
      this.service = {}
    },
    handleBill() {
      this.showBillingDialog = true
    },
    deleteFeeStructure(data) {
      const index = this.billingProduct.fees.indexOf(data)
      if (index > -1) {
        this.billingProduct.fees.splice(index, 1)
      }

      const index2 = this.billingProduct.fees_.indexOf(data)
      if (index2 > -1) {
        this.billingProduct.fees_.splice(index, 1)
      }
    },
    resetForm() {
      this.$refs.feeStructure.resetFields()
      this.$refs.billingProduct.resetFields()
    },
    closeDialog() {
      this.billingProduct = {
        billable: '',
        currency_id: '',
        expire_days: '',
        fees: [],
        licence_id: '',
        payment_mode: ''
      }
      this.standAloneFeeStructure = {
        fee_id: '',
        amount: ''
      }
      this.showBillingDialog = false
    }
  }
}
</script>

<style>

</style>
