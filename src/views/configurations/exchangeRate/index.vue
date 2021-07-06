<template>
  <div class="app-container">

    <!-- start top filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_EXCHANGE_RATE_VIEW', 'ROLE_EXCHANGE_RATE_VIEW_ALL']"
        placeholder="Search by name, code"
        style="width: 20rem"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_EXCHANGE_RATE_VIEW', 'ROLE_EXCHANGE_RATE_VIEW_ALL']"
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
        v-permission="['ROLE_EXCHANGE_RATE_SAVE']"
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
      <el-button
        v-permission="['ROLE_EXCHANGE_RATE_MAKE_EXCHANGE']"
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"

        icon="el-icon-money"
        @click="handleExchange"
      >
        Calculate Exchange Rate
      </el-button>
    </div>
    <!-- end top filter -->

    <!-- start list all exchange rate -->
    <el-table
      v-permission="['ROLE_EXCHANGE_RATE_VIEW','ROLE_EXCHANGE_RATE_VIEW_ALL']"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >

      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Exchange Details" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currecyFrom.name }} <b> TO </b> {{ scope.row.currecyTo.name }}</span><br>
          <span>1 {{ scope.row.currecyFrom.name }} = {{ scope.row.amount }} {{ scope.row.currecyTo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Period" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }} <b> TO </b> {{ scope.row.expireDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_EXCHANGE_RATE_EDIT']"
            plain
            size="mini"

            type="warning"
            icon="el-icon-warning-outline"
            @click="editExcRate(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['ROLE_EXCHANGE_RATE_DELETE']"
            plain
            size="mini"

            type="danger"
            icon="el-icon-delete"
            :loading="viewRolesLoading"
            @click="delExcRate(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- end list all exchange rate -->

    <pagination
      v-permission="['ROLE_EXCHANGE_RATE_VIEW','ROLE_EXCHANGE_RATE_VIEW_ALL']"
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />

    <!-- start add/edit and delete exchange rate -->
    <el-dialog :visible.sync="showExchangeRateDialog" :title="title" width="50%">
      <el-form
        ref="exchangeRate"
        :model="exchangeRate"
        :rules="exchangeRateRules"
        label-width="140px"
        label-position="top"
      >
        <!-- start-->
        <el-form-item label="Exchange rate">
          <el-col class="line" :span="1"><b>1</b></el-col>
          <el-col :span="7">
            <!-- <el-badge is-dot class="item" style="width: 100%;"> TZS </el-badge> -->
            <el-select v-model="exchangeRate.currecyFromId" placeholder="From Exchange Rate" style="width: 100%;">
              <template v-for="cur in filterListValueByCurrency">
                <el-option v-if="cur.name !== 'TZS'" :key="cur.id" :label="cur.name" :value="cur.id" />
              </template>
            </el-select>
          </el-col>
          <el-col class="line" :span="4" align="center"> <b> equals to </b> </el-col>
          <el-col :span="5"><el-input v-model="exchangeRate.amount" placeholder="Amount" style="width:90%;" /></el-col>
          <el-col :span="7">
            <el-select v-model="exchangeRate.currecyToId" placeholder="To Exchange Rate" style="width:100%;">
              <template v-for="cur in filterListValueByCurrency">
                <el-option v-if="cur.name === 'TZS'" :key="cur.id" :label="cur.name" :value="cur.id" />
              </template>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="Period">
          <el-col :span="11">
            <el-date-picker v-model="exchangeRate.startDate" type="date" placeholder="FROM" style="width: 100%;" />
          </el-col>
          <el-col :span="2" class="line" align="center">-</el-col>
          <el-col :span="11">
            <el-date-picker v-model="exchangeRate.expireDate" type="date" placeholder="TO" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <!--end-->
        <el-form-item v-if="title === 'Add Exchange Rate'">
          <el-button
            v-permission="['ROLE_EXCHANGE_RATE_SAVE']"
            plain
            size="mini"
            type="primary"
            @click="submitForm('exchangeRate')"
          >Create
          </el-button>
          <el-button plain size="mini" @click="resetForm('exchangeRate')">Reset</el-button>
        </el-form-item>
        <el-form-item v-if="title === 'Edit Exchange Rate'">
          <el-button
            v-permission="['ROLE_EXCHANGE_RATE_EDIT']"
            plain
            size="mini"
            type="primary"
            @click="submitFormEdit('exchangeRate')"
          >Edit
          </el-button>
          <el-button plain size="mini" @click="clearDialog">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- end add/edit and delete exchange rate -->

    <!-- start check exchange rate -->
    <el-dialog :visible.sync="checkExchangeRateDialog" :title="checkTitle" width="50%">
      <el-form
        ref="checkExchangeRate"
        :model="checkExchangeRate"
        :rules="checkExchangeRateRules"
        label-width="140px"
        label-position="top"
      >
        <!-- start-->
        <el-form-item label="Exchange Conversion">
          <el-col :span="12">
            <el-select v-model="checkExchangeRate.currecyFromId" placeholder="From Exchange Rate" style="width: 90%;">
              <template v-for="cur in filterListValueByCurrency">
                <el-option :key="cur.id" :label="cur.name" :value="cur.id" />
              </template>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-model="checkExchangeRate.currecyToId" placeholder="To Exchange Rate" style="width: 90%;">
              <template v-for="cur in filterListValueByCurrency">
                <el-option :key="cur.id" :label="cur.name" :value="cur.id" />
              </template>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="Exchange Date">
          <el-col :span="12">
            <el-date-picker v-model="checkExchangeRate.exchangeDate" type="date" placeholder="Exchange date" style="width: 90%;" />
          </el-col>

          <el-col :span="12">
            <el-input v-model="checkExchangeRate.amount" placeholder="Amount" style="width:90%;" />
          </el-col>
        </el-form-item>
        <!--end-->

        <el-form-item v-show="visibleResult">
          <b>{{ amount_check }}</b>  USD is equal to  <b>{{ result_check }}</b>  TZS on {{ exchangeDate_check }}.
        </el-form-item>

        <el-form-item v-if="checkTitle === 'Calculate Exchange Rate'">
          <el-button
            v-permission="['ROLE_EXCHANGE_RATE_MAKE_EXCHANGE']"
            plain
            size="mini"
            type="primary"
            @click="checkExchangeRateForm('checkExchangeRate')"
          >Calculate Rate
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- end check exchange rate -->
  </div>
</template>

<script>
import {
  createExchangeRate,
  deleteExchangeRate, getListOfValueByType,
  getListOfExchangeRate, calcExchangeRate,
  updateExchangeRate
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import pagination from '@/components/Pagination'

export default {
  components: {
    pagination
  },
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

      // Pagination
      page: {
        // size: 1,
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      // --end pagination

      title: 'Add Exchange Rate',
      checkTitle: 'Calculate Exchange Rate',
      list: null,
      listLoading: true,
      list_currencies: [],
      viewRolesLoading: false,
      editRolesLoading: false,
      visibleResult: false,
      showExchangeRateDialog: false,
      amount_check: 0,
      result_check: 0,
      exchangeDate_check: undefined,
      exchangeRate: {
        amount: 0,
        currecyFromId: '',
        currecyToId: '',
        startDate: '',
        expireDate: ''
      },
      exchangeRateRules: {
        currecyFromId: [{ required: true, message: 'Please input from currency', trigger: 'blur' }],
        currecyToId: [{ required: true, message: 'Please input to currency', trigger: 'blur' }],
        amount: [{ required: true, message: 'Please input amount', trigger: 'blur' }],
        startDate: [{ required: true, message: 'Please input start date', trigger: 'blur' }],
        expireDate: [{ required: true, message: 'Please input end date', trigger: 'blur' }]
      },

      checkExchangeRateDialog: false,
      checkExchangeRate: {
        amount: 0,
        exchangeDate: '',
        currecyFromId: '',
        currecyToId: ''
      },
      checkExchangeRateRules: {
        amount: [{ required: true, message: 'Please input amount', trigger: 'blur' }],
        exchangeDate: [{ required: true, message: 'Please input start date', trigger: 'blur' }]
      }
    }
  },
  computed: {
    filterListValueByCurrency: function() {
      return this.list_currencies.filter(currencies => (currencies.type === 'CURRENCY') ? currencies : '')
    }
  },
  created() {
    // TODO -- change the endpoint associated with the fetch data to change
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
    fetchData() {
      this.listLoading = true
      getListOfExchangeRate(this.page.number, this.page.size).then((response) => {
        // this.list = response.data.content
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
        .catch(() => {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createExchangeRate(this.exchangeRate).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Exchange rate created successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('exchangeRate')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('exchangeRate')
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
    submitFormEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const exchangeRateId = this.exchangeRate.id
          this.exchangeRate = {
            amount: this.exchangeRate.amount,
            currecyFromId: this.exchangeRate.currecyFromId,
            currecyToId: this.exchangeRate.currecyToId,
            startDate: this.exchangeRate.startDate,
            expireDate: this.exchangeRate.expireDate
          }
          updateExchangeRate(this.exchangeRate, exchangeRateId).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Exchange Rate edited successfully.',
                showClose: true,
                type: 'success'
              })
              this.resetForm('exchangeRate')
              this.fetchData()
              this.clearDialog()
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('exchangeRate')
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
    editExcRate(data) {
      this.exchangeRate = data
      this.exchangeRate.currecyFromId = data.currecyFrom.id
      this.exchangeRate.currecyToId = data.currecyTo.id
      this.title = 'Edit Exchange Rate'
      this.showExchangeRateDialog = true
    },
    clearDialog() {
      this.title = ''
      this.showExchangeRateDialog = false
      this.exchangeRate = {
        amount: ''
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    delExcRate(data) {
      this.$confirm('This will permanently delete the exchange rate. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteExchangeRate(data.id).then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Exchange rate deleted successfully.',
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
      }).catch(() => {})
    },
    handleExchange() {
      this.checkTitle = 'Calculate Exchange Rate'
      this.checkExchangeRateDialog = true
      this.checkExchangeRate = {}
    },
    checkExchangeRateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          calcExchangeRate(this.checkExchangeRate).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Exchange rate calculated successfully.',
                showClose: true,
                type: 'success'
              })
              this.visibleResult = true
              this.amount_check = response.data.amountInUSD
              this.result_check = response.data.amountInTZS
              this.exchangeDate_check = response.data.startDate
            }
          }).catch(() => {
            this.clearDialog()
            this.resetForm('checkExchangeRate')
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
      this.title = 'Add Exchange Rate'
      this.showExchangeRateDialog = true
      this.exchangeRate = {}
    }
  }
}
</script>

<style scoped>

</style>
