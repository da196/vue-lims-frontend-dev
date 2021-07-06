<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_ENTITY_VIEW_ALL', 'ROLE_ENTITY_VIEW_DETAILS']"
        placeholder="Search by name or Display name"
        style="width: 20rem"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_ENTITY_VIEW_ALL', 'ROLE_ENTITY_VIEW_DETAILS']"
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
        v-permission="['ROLE_ENTITY_VIEW_ALL', 'ROLE_ENTITY_VIEW_DETAILS']"
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
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isActive | statusFilter">{{ scope.row.isActive ? 'Yes' : 'No' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="Category" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center" label="More" width="100">
        <template slot-scope="props">
          <p><b>Email :</b> {{ props.row.email }}</p>
          <p><b>Phone Number:</b> {{ props.row.phone }}</p>
          <p><b>Address:</b> {{ props.row.physicalAddress }}  {{ props.row.postalAddress }}</p>
          <p><b>Website:</b> {{ props.row.website }}</p>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="{row}">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="handleBill(row)"
          >
            Create Bill
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
    <el-dialog :visible.sync="showBillingDialog" :title="title">
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

          <el-form-item label="Currency Name" prop="currency_id" required>
            <el-select v-model="billingProduct.currency_id" placeholder="-- Select Currency --">
              <template v-for="currency in list_currencies">
                <el-option :key="currency.id" :label="currency.name" :value="currency.id" />
              </template>
            </el-select>
          </el-form-item>

          <el-form-item label="Expire days" prop="expire_days" required>
            <el-input v-model="billingProduct.expire_days" type="number" />
          </el-form-item>

          <el-form-item label="Payment Mode" prop="payment_mode" required>
            <el-select v-model="billingProduct.payment_mode" placeholder="-- Select Payment Mode --">
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
                <el-select v-model="standAloneFeeStructure.fee_id" placeholder="-- Select Licence Fee --" style="width: 70%;" @change="onChange($event)">
                  <template v-for="fee in list_fees">
                    <el-option :key="fee.id" :label="fee.name" :value="fee.id" />
                  </template>
                </el-select>
              </el-form-item>

              <el-form-item label="Amount" prop="amount" required>
                <el-input v-model="standAloneFeeStructure.amount" :disabled="true" />
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
import { getAllLicenceFees, getActiveEntityPageable, getLicenceFeeStructure } from '@/api/licences'
import pagination from '@/components/Pagination'
import { getListOfValueByType } from '@/api/configurations'
import { createNewBilling } from '@/api/billings'
import { statusCodes } from '@/utils/status-codes'

export default {
  components: {
    pagination
  },
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
      list_fees: [],
      list_currencies: [],
      title: 'Create New Bill',
      showBillingDialog: false,
      list: null,
      listQuery: {
        title: ''
      },
      listStatus: {
        set: null
      },

      // start pagination
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true,
      // end pagination

      // start other
      multipleSelection: [],
      hasCargoSelection: false,
      downloadLoading: false,
      currentLicenceCategory: {
        id: 0
      },
      // end other

      // start
      activeStep: 1,
      standAloneFeeStructure: {
        fee_id: null,
        amount: ''
      },
      standAloneFeeStructureRules: {
        fee_id: [{ required: true, message: 'Please select licence fee structure', trigger: 'blur' }],
        amount: [{ required: true, message: 'Please type amount', trigger: 'blur' }]
      },
      billingProduct: {
        currency_id: '',
        expire_days: '',
        fees: [],
        licence_id: '',
        payment_mode: '',

        // display only
        fees_: []
      },
      billingProductRules: {
        currency_id: [
          {
            required: true,
            message: 'Please select Currency',
            trigger: 'blur'
          }
        ],
        expire_days: [
          {
            required: true,
            message: 'Please input Expire Days',
            trigger: 'blur'
          }
        ],
        payment_mode: [
          {
            required: true,
            message: 'Please select payment mode',
            trigger: 'blur'
          }
        ]
      },
      listLoading: true,
      formValid: false,
      loadingSave: false,
      // end

      standAloneFeeStructure_: {
        fee_id: null,
        amount: '',
        name: ''
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
    fetchData() {
      this.listLoading = true
      // eslint-disable-next-line no-unused-vars
      getActiveEntityPageable(this.page.number, this.page.size, this.listQuery.title).then(response => {
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
      }).catch(e => {
        // console.log(e)
      })

      // GET CURRENCY ONLY
      getListOfValueByType('CURRENCY').then(response => {
        this.list_currencies = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list_currencies = []
        this.listLoading = false
      })

      // GET FEE STRUCTURE ONLY
      getAllLicenceFees().then((response) => {
        this.list_fees = response.data.content
        this.listLoading = false
      }).catch(() => {
        this.list_fees = []
        this.listLoading = false
      })
    },
    handleBill(data) {
      this.showBillingDialog = true
      this.billingProduct.licence_id = data.id
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
    handleConsolidation() {

    },
    onChange(event) {
      getLicenceFeeStructure(this.standAloneFeeStructure.fee_id).then(response => {
        this.standAloneFeeStructure.amount = response.data.feeAmount
        this.standAloneFeeStructure.fee_id = response.data.id

        // display
        this.standAloneFeeStructure_.amount = response.data.feeAmount
        this.standAloneFeeStructure_.fee_id = response.data.id
        this.standAloneFeeStructure_.name = response.data.name
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
          this.billingProduct.fees.push(this.standAloneFeeStructure)
          this.standAloneFeeStructure = {
            amount: 0,
            fee_id: ''
          }

          this.billingProduct.fees_.push(this.standAloneFeeStructure_)
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
    deleteFeeStructure(data) {
      const index = this.billingProduct.fees.indexOf(data)
      if (index > -1) {
        this.billingProduct.fees.splice(index, 1)
      }
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
      this.billingProduct = {
        currency_id: this.billingProduct.currency_id,
        expire_days: this.billingProduct.expire_days,
        fees: this.billingProduct.fees,
        licence_id: this.billingProduct.licence_id,
        payment_mode: this.billingProduct.payment_mode,
        billable: 'ENTITY'
      }
      // console.log(this.billingProduct)
      // debugger
      createNewBilling(this.billingProduct).then(response => {
        this.loadingSave = false
        // this.closeDialog()
        if (response.code === statusCodes.SUCCESS) {
          this.$message({
            message: 'Bill was created successfully.',
            showClose: true,
            type: 'success'
          })
        }
      }).catch(e => {
        this.loadingSave = false
        this.$message({
          message: 'Sorry, Something went wrong.',
          showClose: true,
          type: 'error'
        })
        // this.closeDialog()
      })
    },
    resetForm() {
      this.$refs.feeStructure.resetFields()
      this.$refs.billingProduct.resetFields()
    },
    closeDialog() {
      this.billingProduct = {
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

<style scoped>

</style>
