//licenceReports

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
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-paperclip"
        @click="handleExport"
      >
        Export
      </el-button>
      <el-button
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="generateReport"
      >
        Generate Report
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Licence Number" align="left" width="200rem">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Licence State" align="center">
        <template slot-scope="scope">
          <el-tag
            effect="plain"
            :type="scope.row.licenceState | applicationStateFilter"
          >
            {{ scope.row.licenceState }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Applicant Name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.applicantEntityName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Licence Product" align="left" width="250rem">
        <template slot-scope="scope">
          {{ scope.row.licenseProduct }}
        </template>
      </el-table-column>
      <el-table-column label="Expiry Date" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.expireDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Application Date" align="left" prop="applicationDate">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationDate | datetimeFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="page.total"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />
  </div>
</template>

<script>

import {
  exportLicencesToExcel,
  getLicenceMainReport,
  getLicenceReports
} from '@/api/reports'
import pagination from '@/components/Pagination'
import { DocumentCreator } from '@/views/reports/report-generator'
import { Packer } from 'docx'
import { saveAs } from 'file-saver'

export default {
  name: 'ApplicationReports',
  components: { pagination },
  data() {
    return {
      list: [],
      page: {
        total: 0,
        number: 0,
        size: 20
      },
      currentDate: new Date().toLocaleString().replace(', ', '__').replaceAll('/', '_'),
      listLoading: true,
      viewRolesLoading: false,
      showRolesDialog: false,
      userRoles: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        status: undefined,
        sort: '+id'
      },
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getLicenceReports(this.listQuery.title, null, this.page.number, this.page.size)
        .then(response => {
          this.listLoading = false
          this.list = response.data.content
          this.page.total = response.data.content.length
        })
    },
    handleFilter() {

    },
    getNextData() {
      if (this.page.number > 0) {
        this.page.number = this.page.number - 1
      }
      this.listLoading = true
      this.fetchData()
      this.page.number += 1
    },

    handleExport() {
      this.$message({
        type: 'info',
        message: 'Download started'
      })
      exportLicencesToExcel().then(response => {
        const currentDate = new Date().toLocaleString().replace(', ', '__').replaceAll('/', '_')
        const fileName = `APPLICATION_REPORT_AS_OF_ ${currentDate}.xls`
        const blob = new Blob([response.data], { type: response.type })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    },
    generateReport() {
      this.$message({
        type: 'info',
        message: 'Download started'
      })
      getLicenceMainReport(0, 10000).then(response => {
        const activeLicenses = response.data.activeLicenses.content
        const allLicenses = response.data.allLicenses.content
        const cancelledLicenses = response.data.cancelledLicenses.content
        const expiredLicenses = response.data.expiredLicenses.content
        const suspendedLicenses = response.data.suspendedLicenses.content

        const documentCreator = new DocumentCreator()
        const doc = documentCreator.createlicence(allLicenses, activeLicenses, expiredLicenses, cancelledLicenses, suspendedLicenses, 'licence')

        Packer.toBlob(doc).then(blob => {
          saveAs(blob, `LIMS_Licence_Report_${this.currentDate} .docx`)
        })
      })
    },
    clearDialog() {
      this.title = ''
      this.showDialog = false
      this.dialogData = {}
      this.reportGenerationForm = {}
      this.submissionLoading = false
      this.resetForm('reportGenerationForm')
    }
  }
}
</script>

<style scoped>

</style>
