<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search"
        style="width: 200px"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        :placeholder="'Licence Status'"
        clearable
        size="mini"
        class="filter-item"
        style=" margin-left: 10px"
      >
        <el-option
          v-for="item in statusList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
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
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column label="#" align="center" width="50">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.licenceState | statusFilter">{{ scope.row.licenceState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Licence Number">
        <template slot-scope="scope">
          {{ scope.row.applicationNumber }}
        </template>
      </el-table-column>
      <el-table-column label="Entity Name">
        <template slot-scope="scope">
          {{ scope.row.applicantEntityName }}
        </template>
      </el-table-column>
      <el-table-column label="Licence Product">
        <template slot-scope="scope">
          <span>{{ scope.row.licenseProduct }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="issuedDate" label="Issue Date">
        <template slot-scope="scope">
          <span>{{ scope.row.issuedDate.split('T')[0] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="{row}">
          <!--<el-button
            plain
            size="mini"
            type="primary"
            @click="handleBill(row)"
          >
            Create Bill
          </el-button>-->
          <el-button
            plain
            size="mini"
            type="primary"
            @click="handleView(row)"
          >
            Manage
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
import { encodeHashId } from '@/utils'
import { getAllLicenceFees, getLicenceFeeStructure } from '@/api/licences'
import pagination from '@/components/Pagination'
import { getListOfValueByType } from '@/api/configurations'
import { createNewBilling } from '@/api/billings'
import { statusCodes } from '@/utils/status-codes'
import { getAllLicenceByLicenceStateAndKeyWord } from '@/api/reports'

export default {
  components: {
    pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'ACTIVE': 'success',
        'Incomplete': 'warning',
        'Published Public Notice': 'info',
        'Draft': 'warning',
        'Issued': 'success',
        'WAITING FOR PAYMENT': 'warning'
      }
      return statusMap[status?.trim()]
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
        title: '',
        type: '',
        showClear: false
      },
      listStatus: {
        set: null
      },

      // start pagination
      page: {
        size: 10,
        totalElements: 10,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // end pagination

      // start other
      IndividualLicenseTypes: [
        { key: 'NFL', value: 'Network Facilities Licences' },
        { key: 'NSL', value: 'Network Services Licences' },
        { key: 'ASL', value: 'Application Services Licences' },
        { key: 'CSL', value: 'Content Services Licences' }
      ],
      NumberingLicenseTypes: [
      ],
      ClassLicenceTypes: [],
      TypeApprovalTypes: [],
      AllLicenceTypes: [],
      multipleSelection: [],
      hasCargoSelection: false,
      downloadLoading: false,
      filterList: [],
      statusList: [{ key: 'ACTIVE', value: 'Active' }, { key: 'ALL', value: '' }, { key: 'MINISTRY', value: 'With Ministry' }],
      currentLicenceCategoryLabel: 'ALL',
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
    this.licenceType = this.$route.path.split('/')[1].replace('-', '')
    this.currentLicenceCategoryLabel = this.$route.meta.licenceCategory
    this.listQuery.type = this.$route.meta.query_type === 'ALL' ? '' : this.$route.meta.query_type
    this.fetchData()
    this.getOtherDetails()
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
      getAllLicenceByLicenceStateAndKeyWord(this.page.number, this.page.size, this.listQuery.type, this.listQuery.title).then(response => {
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
          this.licence_id = response.data.content.id
          this.filterPageData(response.data.page)
        } else {
          this.$message({
            message: 'No data found',
            showClose: true,
            type: 'info'
          })
        }
      }).catch(e => {
      })
    },
    getOtherDetails() {
      getListOfValueByType('CURRENCY').then(response => {
        this.list_currencies = response.data.content
      }).catch(() => {
        this.list_currencies = []
      })

      // GET FEE STRUCTURE ONLY
      getAllLicenceFees().then((response) => {
        this.list_fees = response.data.content
      }).catch(() => {
        this.list_fees = []
      })
    },

    handleView(data) {
      const licence = encodeHashId(data.id)
      this.$router.push({ name: 'allLicenceDetails',
        params: { userHash: licence, selectedLicenceType: 'LICENCE' }})
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
      this.listQuery.type = ''
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
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
        billable: 'LICENCE'
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
