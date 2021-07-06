<template>
  <div v-loading="!licenceProductLoading" class="app-container">
    <el-steps :active="activeStep" finish-status="success" align-center>
      <el-step title="Licence Product" />
      <el-step title=" Fee Structures" />
    </el-steps>
    <div v-if="activeStep === 1">
      <el-form

        ref="licenceProduct1"
        :model="licenceProduct"
        :rules="licenceProduct1Rules"
        label-width="210px"
        label-position="left"
      >

        <el-form-item label="Products Name" prop="name" required>
          <el-input v-model="licenceProduct.name" :readonly="isViewEvent" />
        </el-form-item>
        <el-form-item label="Products Display Name" prop="displayName" required>
          <el-input v-model="licenceProduct.displayName" :readonly="isViewEvent" />
        </el-form-item>
        <el-form-item label="Products Code" prop="code" required>
          <el-input v-model="licenceProduct.code" :readonly="isViewEvent" />
        </el-form-item>
        <el-form-item label="Licence Workflows" prop="workflows">
          <el-select
            v-model="licenceProduct.workflows"
            clearable
            multiple
            collapse-tags
            filterable
            :loading="licenceWorkflowsLoading"
            placeholder="Select Licence Workflows"
            style="min-width: 40vw"
            :disabled="isViewEvent"
          >
            <el-option
              v-for="item in licenceWorkflows"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Licence Service" prop="categoryID" required>
          <el-select
            v-model="licenceProduct.categoryID"
            clearable
            filterable
            :loading="licenceCategoriesLoading"
            placeholder="Select Licence Service"
            style="min-width: 40vw"
            :disabled="isViewEvent"
          >
            <el-option
              v-for="item in licenceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Products Duration (Year(s))" prop="duration" required>
          <el-input v-model="licenceProduct.duration" type="number" :readonly="isViewEvent" />
        </el-form-item>
        <el-form-item label="Products Description" prop="description" required>
          <el-input v-model="licenceProduct.description" type="textarea" :readonly="isViewEvent" />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="activeStep === 2">
      <el-row :gutter="10">
        <el-col v-if="showType === 'edit'" :sm="24" :md="10">
          <el-form
            ref="feeStructure"
            :model="standAloneFeeStructure"
            :rules="standAloneFeeStructureRules"
            label-width="140px"
            label-position="left"
            size="small"
          >
            <el-form-item label="Fee Name" prop="name" required>
              <el-input v-model="standAloneFeeStructure.name" />
            </el-form-item>
            <el-form-item label="GFS Code" prop="code" required>
              <el-input v-model="standAloneFeeStructure.code" />
            </el-form-item>
            <el-form-item label="Account Code" prop="accountCode" required>
              <el-input v-model="standAloneFeeStructure.accountCode" />
            </el-form-item>
            <el-form-item label="Fee Amount" prop="feeAmount">
              <el-input-number v-model="standAloneFeeStructure.feeAmount" :step="100" />
            </el-form-item>
            <el-form-item label="Fee Currency" prop="feeCurrency" required>
              <el-select v-model="standAloneFeeStructure.feeCurrency" placeholder="Select Fee Currency" filterable>
                <el-option v-for="item in currencyTypes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fee Type" prop="feeType" required>
              <el-select v-model="standAloneFeeStructure.feeType" placeholder="Select Fee Type" filterable>
                <el-option v-for="item in feeTypes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fee Percent" prop="feePercent">
              <el-input-number v-model="standAloneFeeStructure.feePercent">
                <template slot="append">%</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="Fee Period" prop="period" required>
              <el-select v-model="standAloneFeeStructure.period" placeholder="Select Fee Period" filterable>
                <el-option v-for="item in feePeriodTypes" :key="item.id" :label="item.displayName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fee Frequency" prop="frequency">
              <el-input-number v-model="standAloneFeeStructure.frequency" />
            </el-form-item>
            <el-form-item label="Applicable State" prop="applicableState" required>
              <el-select v-model="standAloneFeeStructure.applicableState" placeholder="Select Applicable State" filterable>
                <el-option v-for="item in applicableStateType" :key="item.name" :label="item.displayName" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                plain
                size="mini"
                icon="el-icon-plus"
                type="primary"
                @click.prevent="addFeeStructureToList"
              >
                Add Fee Structure
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :sm="24" :md="showType === 'view' ? 24 : 14">
          <h4 style="text-align: center">Fee Structures</h4>
          <el-table fit highlight-current-row border size="small" :data="licenceProduct.feeStructure">
            <el-table-column type="expand">
              <template slot-scope="props">
                <!-- <p>GFS Code: {{ props.row.code }}</p> -->
                <p>Account Code: {{ props.row.accountCode }}</p>
                <p>Frequency: {{ props.row.frequency }}</p>
                <p>Fee Percent: {{ props.row.feePercent }}%</p>
                <p>Fee Type: {{ mapValueTypeById(props.row.feeType, 'feeType') }}</p>
                <p>Period: {{ props.row.period }}</p>
                <p>Applicable State: {{ props.row.applicableState | ToSentenceCase }}</p>
              </template>
            </el-table-column>
            <el-table-column label="Active" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.active | statusFilter">{{ scope.row.active }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="GFS Code" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.code }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Fee Name" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Fee Amount" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.feeType === 9 && scope.row.feePercent > 0">{{ scope.row.feePercent }}% of GAT <span v-if="scope.row.feeAmount > 0"> or <b>{{ mapValueTypeById(scope.row.feeCurrency, 'currency') }} {{ scope.row.feeAmount | toThousandFilter }}</b> whichever is greater.</span></span>
                <span v-else><b> {{ mapValueTypeById(scope.row.feeCurrency, 'currency') }}</b> {{ scope.row.feeAmount | toThousandFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="showType === 'edit'" label="Action" align="center">
              <template slot-scope="scope">
                <el-button
                  plain
                  size="mini"
                  type="warning"
                  @click.prevent="editFeeStructure(scope.row)"
                > Edit</el-button>
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
    <el-row style="margin-top: 20px">
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
        v-if="showType === 'edit'"
        plain
        size="mini"
        style="float: right"
        :disabled="loadingSave"
        :loading="loadingSave"
        type="success"
        @click.prevent="submitLicenceProduct"
      >
        Edit
      </el-button>
      <el-button
        plain
        size="mini"
        style="float: right"
        type="warning"
        @click.prevent="closeDialog"
      >
        Close
      </el-button>
    </el-row>
  </div>
</template>

<script>
import {
  getListOfLicenseCategories,
  getListOfValueByType,
  getWorkflows,
  updateLicenceProducts
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { mapGetters } from 'vuex'
import { toThousandFilter } from '@/filters'

export default {
  name: 'EditProduct',
  filters: {
    toThousandFilter,
    ToSentenceCase(val) {
      return val.replace('_', ' ').split(' ').map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(' ')
    },
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    licenceProductIn: {
      type: Object,
      default: () => {}
    },
    showType: {
      type: String,
      default: () => 'view'
    }
  },
  data() {
    return {
      // licenceProduct: {},
      activeStep: 1,
      standAloneFeeStructure: {
        applicableState: '',
        code: '',
        accountCode: '',
        feeAmount: '',
        feeCurrency: '',
        feePercent: '',
        feeType: '',
        frequency: '',
        name: '',
        period: '',
        id: 0
      },
      standAloneFeeStructureRules: {
        applicableState: [{ required: true, message: 'Please select the fee applicable state', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the GFS code', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }],
        accountCode: [{ required: true, message: 'Please enter the Account code', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }],
        // feeAmount: [{ required: true, message: 'Please enter the fee amount', trigger: 'blur' }],
        feeCurrency: [{ required: true, message: 'Please select the fee currency', trigger: 'blur' }],
        // feePercent: [{ required: true, message: 'Please enter the fee percent', trigger: 'blur' }],
        feeType: [{ required: true, message: 'Please select the fee type', trigger: 'blur' }],
        // frequency: [{ required: true, message: 'Please enter the fee frequency', trigger: 'blur' }],
        name: [{ required: true, message: 'Please enter the fee name', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }],
        period: [{ required: true, message: 'Please enter the fee period', trigger: 'blur' }] },
      licenceProduct1Rules: {
        name: [
          {
            required: true,
            message: 'Please enter the Product name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        displayName: [
          {
            required: true,
            message: 'Please enter the Product Display Name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: 'Please enter the Product Code',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        description: [
          {
            required: true,
            message: 'Please enter the Product Description',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        // workflows: {
        //   required: true,
        //   message: 'Please select associated workflows',
        //   trigger: 'blur'
        // },
        categoryID: {
          required: true,
          message: 'Please select associated Service Group',
          trigger: 'blur'
        },
        duration: {
          required: true,
          message: 'Please add the duration of the licence',
          trigger: 'blur'
        }

      },
      // licenceProduct: {},
      licenceCategories: [],
      licenceCategoriesLoading: true,
      licenceWorkflows: [],
      licenceWorkflowsLoading: true,
      feeTypes: [],
      currencyTypes: [],
      applicableStateType: [
        { name: 'INITIAL_PAYMENT', displayName: 'Initial Payment' },
        { name: 'UNCHARGABLE', displayName: 'Uncharge-able' },
        { name: 'APPLICATION', displayName: 'Application' },
        { name: 'LICENSE_EXPIRED', displayName: 'Licence Expired' },
        { name: 'ACCOUNT_INITIATION', displayName: 'Account Initiation' },
        { name: 'LICENSERENEWAL', displayName: 'Licence Renewal' },
        { name: 'CONSTRUCTIONPERMIT', displayName: 'Construction Permit' }
      ],
      feePeriodTypes: [
        { id: 'ONCE', displayName: 'Once' },
        { id: 'DAILY', displayName: 'Daily' },
        { id: 'WEEKLY', displayName: 'Weekly' },
        { id: 'MONTHLY', displayName: 'Monthly' },
        { id: 'QUARTERLY', displayName: 'Quarterly' },
        { id: 'YEARLY', displayName: 'Yearly' }
      ],
      listOfValuesLoading: true,
      listLoading: true,
      list: [],
      formValid: false,
      loadingSave: false,
      // licenceProductLoading: this.$store.getters['licences/getResponseFound'],
      temp: {}
    }
  },
  computed: {
    ...mapGetters('licences', ['getLicenceProductId', 'getLicenceProduct', 'getResponseFound']),
    licenceProduct() {
      return this.getLicenceProduct
    },
    isViewEvent() {
      return this.showType === 'view'
    },
    licenceProductLoading() {
      return this.getResponseFound
    }

  },
  created() {
    this.fetchLicenceCategories()
    this.fetchLicenceWorkflows()
    this.fetchListOfValues('FEETYPE')
    this.fetchListOfValues('CURRENCY')
  },
  methods: {
    fetchListOfValues(ValueType) {
      this.listOfValuesLoading = true
      getListOfValueByType(ValueType).then(response => {
        this.listOfValuesLoading = false
        if (ValueType === 'CURRENCY') {
          this.currencyTypes = response.data.content
        } else if (ValueType === 'FEETYPE') {
          this.feeTypes = response.data.content
        }
      }).catch(e => {
        this.listOfValuesLoading = false
        this.$message({
          message: 'Sorry, Something went wrong while retrieving list of values for' + ValueType,
          showClose: true,
          type: 'error'
        })
      })
    },
    fetchLicenceCategories() {
      this.licenceCategoriesLoading = true
      getListOfLicenseCategories('leaf', 0).then(response => {
        this.licenceCategories = response.data
        this.licenceCategoriesLoading = false
      }).catch(e => {
        this.licenceCategoriesLoading = false
        this.$message({
          message: 'Sorry, Something went wrong while retrieving licence categories',
          showClose: true,
          type: 'error'
        })
      })
    },
    fetchLicenceWorkflows() {
      this.licenceWorkflowsLoading = true
      getWorkflows(0, 10000).then(response => {
        this.licenceWorkflows = response.data.content
        this.licenceWorkflowsLoading = false
      }).catch(e => {
        this.licenceWorkflowsLoading = false
        this.$message({
          message: 'Sorry, Something went wrong while retrieving licence categories',
          showClose: true,
          type: 'error'
        })
      })
    },
    validateFormAndContinue() {
      if (this.activeStep === 1) {
        this.$refs.licenceProduct1.validate((valid) => {
          if (valid) {
            this.formValid = true
            this.activeStep += 1
          } else {
            this.formValid = false
          }
        })
      } else if (this.activeStep === 2) {
        this.$refs.feeStructure.validate((valid) => {
          if (valid || this.licenceProduct.feeStructure.length > 0) {
            this.formValid = true
            this.activeStep += 1
          } else {
            this.formValid = false
          }
        })
      }
    },
    editFeeStructure(data) {
      const index = this.licenceProduct.feeStructure.indexOf(data)
      if (index > -1) {
        this.licenceProduct.feeStructure.splice(index, 1)
      }
      this.standAloneFeeStructure = data
    },
    deleteFeeStructure(data) {
      const index = this.licenceProduct.feeStructure.indexOf(data)
      if (index > -1) {
        this.licenceProduct.feeStructure.splice(index, 1)
      }
    },
    addFeeStructureToList() {
      this.$refs['feeStructure'].validate((valid) => {
        if (valid) {
          this.standAloneFeeStructure.id = 0
          this.licenceProduct.feeStructure.push(this.standAloneFeeStructure)
          this.standAloneFeeStructure = {
            applicableState: 0,
            code: '',
            accountCode: '',
            feeAmount: 0,
            feeCurrency: 0,
            feePercent: 0,
            feeType: 0,
            frequency: 0,
            name: '',
            period: 0,
            id: 0
          }
        } else {
          return false
        }
      })
    },
    mapValueTypeById(typeId, valueType) {
      if (valueType === 'currency') {
        return this.currencyTypes.filter(e => e.id === typeId)[0].name
      } else if (valueType === 'feeType') {
        return this.feeTypes.filter(e => e.id === typeId)[0].name
      } else {
        return typeId
      }
    },
    resetForm() {
      this.$refs?.feeStructure?.resetFields()
      this.$refs?.licenceProduct1?.resetFields()
    },
    submitLicenceProduct() {
      this.loadingSave = true
      delete this.licenceProduct.feeStructures
      delete this.licenceProduct.category
      const id = this.licenceProduct.id
      delete this.licenceProduct.id
      this.licenceProduct.feeStructure = this.licenceProduct.feeStructure.filter(e => e.active !== false)
      updateLicenceProducts(this.licenceProduct, id).then(response => {
        this.loadingSave = false
        this.closeDialog()
        if (response.code === statusCodes.SUCCESS) {
          this.$message({
            message: 'Licence Product updated successfully.',
            showClose: true,
            type: 'success'
          })
          this.closeDialog()
        }
      }).catch(e => {
        console.log(e)
        this.loadingSave = false
        this.$message({
          message: 'Sorry, Something went wrong.',
          showClose: true,
          type: 'error'
        })
        this.closeDialog()
      })
    },
    closeDialog() {
      this.activeStep = 1
      this.resetForm()
      this.standAloneFeeStructure = {
        applicableState: '',
        code: '',
        feeAmount: '',
        feeCurrency: '',
        feePercent: '',
        feeType: '',
        frequency: '',
        name: '',
        period: '',
        id: 0
      }
      this.$emit('closeDialog', true)
    }
  }
}
</script>

<style scoped>

</style>
