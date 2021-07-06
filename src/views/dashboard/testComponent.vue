<template>
  <div class="app-container">
    <!-- start first row -->
    <el-row :gutter="20" class="panel-group" style="padding-bottom: 20px">
      <el-col :sm="12" :md="6" :lg="6">
        <dashboard-card
          tag="totalLicences"
          heading="TOTAL LICENCES"
          :content="licenseSummary.totalLicense"
          :sub-content1="licenseSummary.subsection1"
          :sub-content2="licenseSummary.subsection2"
          :icon="licenseSummary.icon"
          :icon2="licenseSummary.icon2"
          :icon-color-type="licenseSummary.iconColorType"
          :icon-color-type2="licenseSummary.icon2ColorType"
          :footer-content="licenseSummary.footerContent"
          description-title="Total Licences"
          description-content="This is the total number of licences both active, canceled and expired."
        />
      </el-col>
      <el-col :sm="12" :md="6" :lg="6">
        <dashboard-card
          tag="totalRevenue"
          heading="TOTAL REVENUE"
          content="192.3 Mil TZS"
          sub-content1="QoQ Change 32%"
          sub-content2="MoM Change -12%"
          icon="el-icon-caret-top"
          icon2="el-icon-caret-bottom"
          icon-color-type="success"
          icon-color-type2="danger"
          footer-content="<b>Today: </b> 212M &nbsp; <b>Week:</b> 332M &nbsp; <b>Month:</b>  12M"
          description-title="Total Licences"
          description-content="This is the total revenue collected via the system from licences as well as certificates"
        />
      </el-col>
      <el-col :sm="12" :md="6" :lg="6">
        <dashboard-card
          tag="totalApplications"
          heading="TOTAL APPLICATIONS"
          content="134"
          sub-content2="MoM Change 22%"
          icon="el-icon-caret-top"
          icon2="el-icon-caret-bottom"
          icon-color-type="success"
          icon-color-type2="danger"
          footer-content="<b>New: </b> 212 &nbsp; <b>In-Progress:</b> 332 &nbsp; <b>With Ministry:</b>  12"
          description-title="Total Applications"
          description-content="This is the total number of applications both new and in-progress,
             currently being handled by the system."
        />
      </el-col>
      <el-col :sm="12" :md="6" :lg="6">
        <dashboard-card
          tag="totalCertificates"
          heading="TOTAL CERTIFICATES"
          content="3,130"
          sub-content1="QoQ Change 12%"
          icon="el-icon-caret-top"
          icon-color-type="success"
          footer-content="<b>Approved: </b> 3130 &nbsp; <b>Rejected:</b> 332 &nbsp; <b>Canceled:</b>  12"
          description-title="Total Certificates"
          description-content="This is the total number of certificates issued to electronic devices."
        />
      </el-col>
    </el-row>
    <!-- end first row -->

    <!-- start Second row -->
    <el-row :gutter="20" class="panel-group">
      <el-col :sm="24" :md="16" :lg="16">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Licences" name="first" :lazy="true">

              <v-chart class="chart" :option="option5" @selectchanged="showData" />

            </el-tab-pane>
            <el-tab-pane label="Revenue" name="second" :lazy="true">

              <v-chart class="chart" :option="option21" @selectchanged="showData" />

            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

      <el-col :sm="20" :md="8" :lg="8">
        <el-card>
          <v-chart class="chart" :option="option1" @selectchanged="showData" />
          <v-chart class="chart" :option="option2" @selectchanged="showData" />
        </el-card>
      </el-col>
    </el-row>
    <!-- end Second row -->

    <!-- start Third row -->
    <el-row :gutter="20" class="panel-group" />
    <el-col :sm="24" :md="12">
      <el-card>
        <v-chart class="chart" :option="option3" @selectchanged="showData" />
      </el-card>
    </el-col>
    <el-col :sm="24" :md="12">
      <el-card>
        <v-chart class="chart" :option="option4" @selectchanged="showData" />
      </el-card>
    </el-col>
    <!-- end Third row -->

  </div>
</template>

<script>
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, LinesChart } from 'echarts/charts'
import DashboardCard from '@/views/dashboard/charts/dashboardCard'
import {
  getDashboardReport
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
    DashboardCard,
    VChart
  },
  provide: {
    [THEME_KEY]: {
      // Global palette:
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      series: [{
        type: 'bar',
        // A palette only work for the series:
        color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42']
      }, {
        type: 'pie',
        // A palette only work for the series:
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']
      }]
    }
  },
  data() {
    return {
      licenseSummary: {
        subsection1: '',
        subsection2: '',
        icon: '',
        iconColorType: '',
        icon2: '',
        icon2ColorType: '',
        footerContent: '',
        totalLicense: 0
      },
      revenueSummary: {
        dailyAmount: 0,
        mom: 0,
        momSign: '',
        monthlyAmount: 0,
        qoq: 0,
        qoqSign: '',
        totalAmount: 0,
        weeklyAmount: 0
      },
      applicationsSummary: {
        inprogressApplications: 0,
        newApplications: 0,
        totalApplications: 0,
        underMinistryApplications: 0
      },
      activeName: 'first',
      option1: {
        title: {
          text: 'Revenue Per Category(Mil TZS)',
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [
            'Individual Licence',
            'Class Licence',
            'Numbering Licence',
            'Type Approval'
          ]
        },
        series: [
          {
            name: 'Revenue Per Category',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [
              { value: 135, name: 'Individual Licence' },
              { value: 210, name: 'Class Licence' },
              { value: 34, name: 'Numbering Licence' },
              { value: 105, name: 'Type Approval' }
            ]
          }
        ]
      },
      option2: {
        title: {
          text: 'Licences Per Category',
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [
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
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [
              { value: 300, name: 'Individual Licence' },
              { value: 210, name: 'Class Licence' },
              { value: 234, name: 'Numbering Licence' },
              { value: 135, name: 'Type Approval' }
            ]
          }
        ]
      },
      option3: {
        title: {
          text: 'Licences Requested Vs Issued 2021',
          left: 'right'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: 'left',
          data: ['Licences Requested', 'Licences Issued']
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
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Licences Requested',
            type: 'bar',
            barGap: 0.1,
            emphasis: {
              focus: 'series'
            },
            data: [32, 33, 30, 34, 39, 32, 33, 30, 34, 39, 32, 33]
          },
          {
            name: 'Licences Issued',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [22, 18, 19, 23, 29, 32, 33, 30, 34, 39, 34, 39]
          }
        ]
      },
      option4: {
        animationDuration: 10000,
        legend: {
          left: 'left',
          data: ['Licences Revenue', 'Revenue Progression']
        },
        title: {
          text: 'Licence Revenue and Revenue Progression',
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
          title: {
            text: 'Months'
          },
          nameLocation: 'middle',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          name: 'Income',
          title: {
            text: 'Income(Tz SH)'
          }
        },
        grid: {
          right: 140
        },
        series: [
          {
            name: 'Licences Revenue',
            type: 'line',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 100, 10, 40]
          },
          {
            name: 'Revenue Progression',
            type: 'line',
            data: [22, 18, 19, 23, 29, 32, 33, 30, 34, 39, 34, 39]
          }
        ]
      },
      option5: {
        legend: {
          left: 'left',
          data: ['Active Licences', 'Expired Licences', 'In-progress Licences', 'Cancelled Licences', 'New Applications']
        },
        title: {
          text: 'Licence Filter',
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
          title: {
            text: 'Months'
          },
          nameLocation: 'middle',
          data: ['31-06-2021', '01-07-2021', '02-07-2021', '03-07-2021', '04-07-2021', '05-07-2021', '06-07-2021']
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
      option21: {
        title: {
          text: 'Monthly Licence Revenue Inflation',
          left: 'right'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            var tar
            if (params[1].value !== '-') {
              tar = params[1]
            } else {
              tar = params[0]
            }
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
          }
        },
        legend: {
          data: ['Increase', 'Decrease', 'Total']
        },
        grid: {
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          data: ['2020', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Decrease',
            type: 'bar',
            stack: '总量',
            barGap: 0.1,
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              }
            },
            data: [0, 900, 1245, 1638, 1530, 1376, 1511, 1689, 1975, 1856, 1495, 1695, 1595]
          },
          {
            name: 'Increase',
            type: 'bar',
            barGap: 0.1,
            stack: '总量',
            label: {
              show: true,
              position: 'top'
            },
            data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-', 200, '-']
          },
          {
            name: '',
            type: 'bar',
            barGap: 0.1,
            stack: '总量',
            label: {
              show: true,
              position: 'bottom'
            },
            data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203, '-', 100]
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
      this.listLoading = true
      getDashboardReport().then(response => {
        this.licenseSummary.totalLicense = response.data.licensesummaryDto.totalLicense
        this.licenseSummary.subsection1 = 'QoQ Change ' + response.data.licensesummaryDto.qoq + '%'
        this.licenseSummary.subsection2 = 'MoM Change ' + response.data.licensesummaryDto.mom + '%'
        this.licenseSummary.footerContent = '<b>Active: </b>' + response.data.licensesummaryDto.activeLicense + '&nbsp; <b>Expired: </b>' + response.data.licensesummaryDto.expiredLicense + '&nbsp; <b>Canceled: </b>' + response.data.licensesummaryDto.cancelledLicense

        if (response.data.licensesummaryDto.qoqSign === 'positive') {
          this.licenseSummary.icon = 'el-icon-caret-top'
          this.licenseSummary.iconColorType = 'success'
        } else {
          this.licenseSummary.icon = 'el-icon-caret-bottom'
          this.licenseSummary.iconColorType = 'danger'
        }

        if (response.data.licensesummaryDto.momSign === 'positive') {
          this.licenseSummary.icon2 = 'el-icon-caret-top'
          this.licenseSummary.icon2ColorType = 'success'
        } else {
          this.licenseSummary.icon2 = 'el-icon-caret-bottom'
          this.licenseSummary.icon2ColorType = 'danger'
        }
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
