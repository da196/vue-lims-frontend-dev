<template>
  <div class="app-container">
    <!-- start first row -->
    <el-row :gutter="20" class="panel-group" style="padding-bottom: 20px">
      <el-col v-loading="listLoading" :sm="12" :md="8" :lg="8">
        <custom-dashboard
          v-permission="['ROLE_VIEW_LICENCE_APPL_STATS_REPORT', 'ROLE_VIEW_LICENCE_STATS_REPORT']"
          tag="totalApplications"
          heading="TOTAL APPLICATIONS"
          title-dialog="LIST OF APPLICATIONS"
          label-one="NEW"
          label-two="IN-PROGRESS"
          label-three="WITH MINISTRY"
          :grid-data="allApplications"
          :grid-status1="applicationsSummary.listNewApplications"
          :grid-status2="applicationsSummary.listInprogressApplications"
          :grid-status3="applicationsSummary.listUnderMinistryApplications"
          :content="applicationsSummary.totalApplications"
          :footer-content="applicationsSummary.footerContent"
          description-title="Total Applications"
          description-content="This is the total number of applications both new and in-progress,
             currently being handled by the system."
        />
      </el-col>
      <el-col v-loading="listLoading" :sm="12" :md="8" :lg="8">
        <custom-dashboard
          v-permission="['ROLE_VIEW_LICENCE_APPL_STATS_REPORT', 'ROLE_VIEW_LICENCE_STATS_REPORT']"
          tag="totalLicences"
          heading="TOTAL LICENCES"
          title-dialog="LIST OF LICENCES"
          label-one="ACTIVE"
          label-two="EXPIRED"
          label-three="CANCELLED"
          :grid-data="allLicences"
          :grid-status1="licenseSummary.allActiveLicences"
          :grid-status2="licenseSummary.allExpiredLicences"
          :grid-status3="licenseSummary.allCancelledLicences"
          :content="licenseSummary.totalLicense"
          :footer-content="licenseSummary.footerContent"
          description-title="Total Licences"
          description-content="This is the total number of licences both active, canceled and expired."
        />
      </el-col>

      <el-col v-loading="listLoading" :sm="12" :md="8" :lg="8">
        <custom-dashboard
          v-permission="['ROLE_VIEW_LICENCE_APPL_STATS_REPORT', 'ROLE_VIEW_LICENCE_STATS_REPORT']"
          tag="totalCertificates"
          title-dialog="LIST OF CERTIFICATES"
          label-one="APPROVED"
          label-two="REJECTED"
          label-three="CANCELLED"
          :grid-data="allCertificates"
          :grid-status1="allApprovedCertificates"
          :grid-status2="allRejectedCertificates"
          :grid-status3="allCancelledCertificates"
          heading="TOTAL CERTIFICATES"
          :content="certificateSummary.totalCertificate"
          footer-content="<b>Approved: </b> 0 &nbsp; <b>Rejected:</b> 0 &nbsp; <b>Canceled:</b>  0"
          description-title="Total Certificates"
          description-content="This is the total number of certificates issued to electronic devices."
        />
      </el-col>
    </el-row>
    <!-- end first row -->

    <!-- start Second row -->
    <el-row :gutter="20" class="panel-group">
      <el-col :sm="12" :md="16" :lg="16">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Licences" name="first" :lazy="true">
              <v-chart class="chart" :option="optionBar" @selectchanged="showData" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-card style="height: 496px;">
          <v-chart class="chart" :option="optionPie" @selectchanged="showData" />
        </el-card>
      </el-col>
    </el-row>
    <!-- end Second row -->

  </div>
</template>

<script>
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, LinesChart } from 'echarts/charts'
import CustomDashboard from '@/views/dashboard/charts/customDashboard'
import { getListLicensesDashboardReport, getListApplicationsDashboardReport } from '@/api/dashboard'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { defineComponent } from 'vue-demi'

use([
  SVGRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  LineChart,
  LinesChart
])

export default defineComponent({
  name: 'HelloWorld',
  components: {
    CustomDashboard,
    VChart
  },
  provide: {
    [THEME_KEY]: {
      // Global palette:
      color: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26']
    }
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
      licenceNames: [],
      // All APPLICATIONS
      allApplications: [],
      allNewApplications: [],
      allInprogressApplications: [],
      allMinistryApplications: [],

      // All LICENCES
      allLicences: [],
      allActiveLicences: [],
      allExpiredLicences: [],
      allCancelledLicences: [],

      // All CERTIFICATES
      allCertificates: [],
      allApprovedCertificates: [],
      allRejectedCertificates: [],
      allCancelledCertificates: [],

      licenseSummary: {
        totalLicense: 0,
        allActiveLicences: [],
        allExpiredLicences: [],
        allCancelledLicences: [],
        footerContent: ''
      },

      certificateSummary: {
        footerContent: '',
        totalCertificate: 0
      },

      applicationsSummary: {
        status: '',
        totalApplications: 0,
        listTotalApplications: [],
        inprogressApplications: 0,
        listInprogressApplications: [],
        newApplications: 0,
        listNewApplications: [],
        underMinistryApplications: 0,
        listUnderMinistryApplications: [],
        footerContent: ''
      },
      activeName: 'first',
      optionBar: {
        legend: {
          left: 'left',
          data: ['Active Licences', 'Expired Licences', 'In-progress Licences', 'Cancelled Licences', 'New Applications']
        },
        title: {
          text: '',
          left: 'right'
        },
        tooltip: {
          order: 'valueDesc',
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          data: ['INDIVIDUAL LICENCE', 'CLASS LICENCE', 'NUMBERING LICENCE']
        },
        yAxis: {
          name: 'Licence Count'
        },
        grid: {
          right: 140,
          height: '90%'
        },
        series: [
          {
            name: 'Active Licences',
            type: 'line',
            data: [10, 41, 35, 51, 49, 62, 69]
          },
          {
            name: 'Expired Licences',
            type: 'line',
            data: [20, 11, 10, 37, 19, 30, 23]
          },
          {
            name: 'In-progress Licences',
            type: 'line',
            data: [22, 18, 19, 23, 29, 32, 33]
          },
          {
            name: 'Cancelled Licences',
            type: 'line',
            data: [25, 10, 19, 26, 31, 73, 53]
          },
          {
            name: 'New Applications',
            type: 'line',
            data: [20, 12, 73, 35, 21, 53, 73]
          }
        ]
      },
      optionPie: {
        title: {
          text: '',
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [],
          data_: [
            'Individual Licence',
            'Class Licence',
            'Numbering Licence',
            'Type Approval'
          ]
        },
        series: [
          {
            name: 'Licences Per Category',
            type: 'pie',
            radius: '50%',
            // data:this.mockData
            data: [
              { name: 'Individual Licence', value: 300 },
              { name: 'Class Licence', value: 210 },
              { name: 'Numbering Licence', value: 234 },
              { name: 'Type Approval', value: 135 }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },

      // Pagination
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true
      // --end pagination
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
      // Deals with licences only
      getListLicensesDashboardReport(this.page.number, this.page.size, this.listQuery.title).then(response => {
        // List for licences
        this.licenseSummary.allLicenses = response.data.allLicences
        this.licenseSummary.allActiveLicences = response.data.activeLicenses
        this.licenseSummary.allExpiredLicences = response.data.expiredLicenses
        this.licenseSummary.allCancelledLicences = response.data.cancelledLicenses
        // Count for licences
        this.licenseSummary.totalLicense = response.data.licenceStatistics.totalLicences
        this.licenseSummary.activeLicense = response.data.licenceStatistics.activeLicense
        this.licenseSummary.expiredLicense = response.data.licenceStatistics.expiredLicense
        this.licenseSummary.cancelledLicense = response.data.licenceStatistics.cancelledLicense
        this.licenseSummary.footerContent = '<b>Active: </b>' + this.licenseSummary.activeLicense + '&nbsp; <b>Expired: </b>' + response.data.licenceStatistics.expiredLicense + '&nbsp; <b>Canceled: </b>' + response.data.licenceStatistics.cancelledLicense
        // eslint-disable-next-line handle-callback-err
        this.listLoading = false
      }).catch(_ => {
        this.listLoading = false
      })

      // Deals with applications only
      getListApplicationsDashboardReport(this.page.number, this.page.size, this.listQuery.title).then(response => {
        // List for Applications
        this.applicationsSummary.listTotalApplications = response.data.totalApplications
        this.applicationsSummary.listInprogressApplications = response.data.totalApplications
        this.applicationsSummary.listNewApplications = response.data.totalApplications
        this.applicationsSummary.listUnderMinistryApplications = response.data.totalApplications
        // Count for Applications
        this.applicationsSummary.totalApplications = response.data.totalApplications
        this.applicationsSummary.inprogressApplications = response.data.totalApplications
        this.applicationsSummary.newApplications = response.data.totalApplications
        this.applicationsSummary.underMinistryApplications = response.data.totalApplications

        this.applicationsSummary.footerContent = '<b>New: </b>' + this.applicationsSummary.newApplications + '&nbsp; <b>In-progess: </b>' + this.applicationsSummary.inprogressApplications + '&nbsp; <b>With Ministry: </b>' + this.applicationsSummary.underMinistryApplications
        // Results for certificates
        this.certificateSummary.totalCertificate = 0
        this.certificateSummary.footerContent = '<b>Aproved: </b>' + 0 + '&nbsp; <b>Rejected: </b>' + 0 + '&nbsp; <b>Canceled: </b>' + 0
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {

      })
    },
    showData(val) {
      console.log(val)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
})
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
