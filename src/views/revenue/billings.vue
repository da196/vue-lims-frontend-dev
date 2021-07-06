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
      <el-table-column label="Date Created" align="center">
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllBillings } from '@/api/billings'
import pagination from '@/components/Pagination'

export default {
  components: { pagination },
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
      list: null,
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
      addClient: false
    }
  },
  computed: {
    ...mapGetters('client', ['GetClientResponse']),
    hasCargoSelection: function() {
      return this.multipleSelection.length !== 0
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
      getAllBillings(this.page.number, this.page.size, this.listQuery.title).then((response) => {
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
      }).catch(() => {
        this.list = []
        this.listLoading = false
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
      console.log('handle download')
    },
    handleCreate() {
      this.service = {}
    }
  }
}
</script>

<style>

</style>
