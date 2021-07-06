// ApplicationReports
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
      <el-table-column label="Application Number" align="left" width="200rem">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Application Type" align="center">
        <template slot-scope="scope">
          <el-tag
            effect="plain"
            :type="scope.row.applicationType | applicationStateFilter"
          >
            {{ scope.row.applicationType }}
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
      <el-table-column label="Licence State" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.licenceState }}</span>
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
  exportApplicationsToExcel,
  getLicenceApplicationMainReport,
  getLicenceApplications,
  getLicenceMainReport
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
      getLicenceApplications(this.listQuery.title, null, this.page.number, this.page.size)
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
      getLicenceApplications(null, null, this.page.number, this.page.size)
        .then(response => {
          this.listLoading = false
          this.list = response.data.content
        })
      this.page.number += 1
    },
    handleExport() {
      this.$message({
        type: 'info',
        message: 'Download started'
      })
      exportApplicationsToExcel().then(response => {
        const fileName = `APPLICATION_REPORT_AS_OF_ ${this.currentDate}.xls`
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
      getLicenceApplicationMainReport(0, 10000).then(response => {
        console.log(response.data.content)
        const allApplications = response.data.allApplications.content
        const atMinistryApplications = response.data.atMinistryApplications.content
        const cancelledApplications = response.data.cancelledApplications.content
        const inProgressApplications = response.data.inProgressApplications.content
        const newApplications = response.data.newApplications.content

        const documentCreator = new DocumentCreator()
        const doc = documentCreator.createApplication(allApplications, newApplications, inProgressApplications, atMinistryApplications, cancelledApplications, 'application')

        Packer.toBlob(doc).then(blob => {
          // console.log(blob)
          saveAs(blob, `LIMS_Application_Report_${this.currentDate} .docx`)
          console.log('Document created successfully')
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
