<template>
  <div class="app-container">
    <!-- start first row -->
    <el-row :gutter="20" class="panel-group" style="padding-bottom: 20px">
      <el-col v-loading="listLoading" :sm="12" :md="8" :lg="8">
        <customize-dashboard
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
        <customize-dashboard
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
        <customize-dashboard
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
import test from '@/data/test'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, LinesChart } from 'echarts/charts'
import CustomizeDashboard from '@/views/dashboard/charts/customizeDashboard'
import {
  getLicencesDashboardReport,
  getApplicationsDashboardReport,
  // getListApplicationsDashboardReport,
  getAllLicencesDashboardReport,
  getListApplicationswithStatus,
  getListLicenceswithStatus
} from '@/api/dashboard'
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
    CustomizeDashboard,
    VChart
  },
  provide: {
    [THEME_KEY]: {
      // Global palette:
      color: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26']
      // color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      // series: [{
      //   type: 'bar',
      //   // A palette only work for the series:
      //   color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42']
      // }, {
      //   type: 'pie',
      //   // A palette only work for the series:
      //   color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']
      // }]
    }
  },
  data() {
    return {
      mockData: test,
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
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // start 1.
      const data = this.mockData
      data.forEach(d => {
        const { licence_name } = d
        this.optionPie.legend.data.push(licence_name)
      })
      // console.log(this.licenceNames)
      // start 2.
      this.mockData.forEach(function(obj) {
        obj.name = obj.licence_name
        obj.value = obj.total_licence
        delete obj.licence_name
        delete obj.total_licence
      })
      // console.log(this.mockData)

      this.listLoading = true
      // Count number of licences
      getLicencesDashboardReport().then(response => {
        this.licenseSummary.totalLicense = response.data.totalLicences
        this.licenseSummary.footerContent = '<b>Active: </b>' + response.data.activeLicense + '&nbsp; <b>Expired: </b>' + response.data.expiredLicense + '&nbsp; <b>Canceled: </b>' + response.data.cancelledLicense
        // eslint-disable-next-line handle-callback-err
        this.listLoading = false
      }).catch(_ => {
        this.listLoading = false
      })

      // Count number of applications
      getApplicationsDashboardReport().then(response => {
        this.applicationsSummary.totalApplications = response.data.totalApplications
        this.applicationsSummary.footerContent = '<b>New: </b>' + response.data.newApplications + '&nbsp; <b>In-progess: </b>' + response.data.inProgressApplications + '&nbsp; <b>With Ministry: </b>' + response.data.underMinistryApplications

        this.certificateSummary.totalCertificate = 0
        this.certificateSummary.footerContent = '<b>Aproved: </b>' + 0 + '&nbsp; <b>Rejected: </b>' + 0 + '&nbsp; <b>Canceled: </b>' + 0
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {

      })

      // START -- APPLICATIONS --
      // List of all applications
      getListApplicationswithStatus(this.applicationsSummary.status).then(response => {
        this.allApplications = response.data.content
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
      })
      // List of New applications
      getListApplicationswithStatus('NEW').then(response => {
        this.applicationsSummary.listNewApplications = response.data.content
        this.applicationsSummary.newApplications = response.data.content.length
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
      })
      // List of In-progress applications
      getListApplicationswithStatus('INPROGRESS').then(response => {
        this.applicationsSummary.listInprogressApplications = response.data.content
        this.applicationsSummary.inprogressApplications = response.data.content.length
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
      })
      // List of With Ministry applications
      getListApplicationswithStatus('ATMINISTRY').then(response => {
        this.applicationsSummary.listUnderMinistryApplications = response.data.content
        this.applicationsSummary.underMinistryApplications = response.data.content.length
        // eslint-disable-next-line handle-callback-err
      })
        .catch(_ => {
        })
      // END -- APPLICATIONS --

      // List of all licences
      getAllLicencesDashboardReport().then(response => {
        this.allLicences = response.data.content
      }).catch(_ => {

      })

      // List of all licences
      getAllLicencesDashboardReport().then(response => {
        this.allLicences = response.data.content
      }).catch(_ => {

      })
      // Active Licences
      getListLicenceswithStatus('ACTIVE').then(response => {
        this.licenseSummary.allActiveLicences = response.data.content
      }).catch(_ => {

      })
      // Expired Licences
      getListLicenceswithStatus('EXPIRED').then(response => {
        this.licenseSummary.allExpiredLicences = response.data.content
      }).catch(_ => {

      })
      // Cancelled Licences
      getListLicenceswithStatus('CANCELED').then(response => {
        this.licenseSummary.allCancelledLicences = response.data.content
      }).catch(_ => {

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
