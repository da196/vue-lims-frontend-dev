<template>
  <div class="app-container">
    <div class="dashboard-container">
      <el-row :gutter="20" class="panel-group" style="padding-bottom: 20px">
        <el-col :sm="12" :md="6" :lg="6">
          <dashboard-card
            tag="totalLicences"
            heading="TOTAL LICENCES"
            content="192,212"
            sub-content1="QoQ Change 12%"
            sub-content2="MoM Change 22%"
            icon="el-icon-caret-top"
            icon2="el-icon-caret-bottom"
            icon-color-type="success"
            icon-color-type2="danger"
            footer-content="<b>Active: </b> 212 &nbsp; <b>Expired:</b> 332 &nbsp; <b>Canceled:</b>  12"
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

      <el-row :gutter="20" class="panel-group">
        <el-col :sm="24" :md="16" :lg="16">
          <el-card>
            <el-tabs v-model="activeName">
              <el-tab-pane label="Licences" name="first">
                <el-row>
                  <h5>Licences Filter</h5>
                </el-row>
                <el-row>
                  <LineChart v-bind="config3" :data="chartData" />
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="Revenue" name="second">
                <el-row>
                  <h5> Revenue Filter location</h5>
                </el-row>
                <el-row>
                  <WaterfallChart v-bind="config4" :data="data3" />
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
        <el-col :sm="24" :md="8" :lg="8" />
        <el-card>
          <PieChart v-bind="config5" :data="data6" />
          <PieChart v-bind="configPieLicencePerCategory" :data="dataPieLicencePerCategory" />
        </el-card>
      </el-row>

      <el-row :gutter="20" class="panel-group">
        <el-col :sm="24" :md="12">
          <el-card>
            <h4 style="text-align: center"> Licences Requested Vs Licences Issued </h4>
            <h5 style="text-align: center"> for the year ending 2021</h5>
            <ColumnChart v-bind="configLicenceRequestedVsLicenceIssued" :data="dataLicenceRequestedVsLicenceIssued" />
          </el-card>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-card>

            <h4 style="text-align: center"> Licence Revenue and Revenue Progression</h4>
            <h5 style="text-align: center"> for the year ending 2021</h5>
            <LineChart v-bind="configRevenueAndRevenueProjection" :data="dataRevenueAndRevenueProjection" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue-demi'
import { LineChart, BarChart, WaterfallChart, PieChart, ColumnChart } from '@opd/g2plot-vue'
import DashboardCard from '@/views/dashboard/charts/dashboardCard'
import { dummyData3 } from '@/views/dashboard/charts/charts'
export default defineComponent({
  name: 'AnalysisDashboard',
  components: {
    DashboardCard,
    LineChart,
    BarChart,
    WaterfallChart,
    PieChart,
    ColumnChart
  },
  data() {
    return {
      dataRevenueAndRevenueProjection: [
        { name: 'revenue', month: 'Jan', value: 3 },
        { name: 'revenue', month: 'Feb', value: 4 },
        { name: 'revenue', month: 'March', value: 7 },
        { name: 'revenue', month: 'April', value: 5 },
        { name: 'revenue', month: 'May', value: 4 },
        { name: 'revenue', month: 'June', value: 6 },
        { name: 'revenue', month: 'July', value: 7 },
        { name: 'revenue', month: 'August', value: 9 },
        { name: 'revenue', month: 'September', value: 15 },
        { name: 'Revenue Progression', month: 'Jan', value: 1 },
        { name: 'Revenue Progression', month: 'Feb', value: 4 },
        { name: 'Revenue Progression', month: 'March', value: 5 },
        { name: 'Revenue Progression', month: 'April', value: 5 },
        { name: 'Revenue Progression', month: 'May', value: 3 },
        { name: 'Revenue Progression', month: 'June', value: 6 },
        { name: 'Revenue Progression', month: 'July', value: 7 },
        { name: 'Revenue Progression', month: 'August', value: 9 },
        { name: 'Revenue Progression', month: 'September', value: 11 },
        { name: 'Revenue Progression', month: 'October', value: 12 },
        { name: 'Revenue Progression', month: 'November', value: 13 },
        { name: 'Revenue Progression', month: 'December', value: 12 }
      ],
      configRevenueAndRevenueProjection: {
        xField: 'month',
        yField: 'value',
        height: 350,
        seriesField: 'name',
        xAxis: {
          range: [0, 1],
          tickCount: 5
        },
        yAxis: {
          title: {
            text: 'Revenue in Mil. TZS'
          }
        },
        areaStyle: () => {
          return {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
          }
        },
        meta: {
          month: {
            alias: 'Month'
          },
          value: {
            alias: 'Revenue',
            formatter: (v) => `${v * 100} Mil.`
          }
        },
        animation: false,
        smooth: true,
        slider: {
          start: 0.1,
          end: 1,
          trendCfg: {
            isArea: true
          }
        }
      },
      data: [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 11 }
      ],
      dataLicenceRequestedVsLicenceIssued: [
        { name: 'Licences Requested', month: 'Jan', value: 3 },
        { name: 'Licences Requested', month: 'Feb', value: 4 },
        { name: 'Licences Requested', month: 'March', value: 7 },
        { name: 'Licences Requested', month: 'April', value: 5 },
        { name: 'Licences Requested', month: 'May', value: 4 },
        { name: 'Licences Requested', month: 'June', value: 6 },
        { name: 'Licences Requested', month: 'July', value: 7 },
        { name: 'Licences Requested', month: 'August', value: 9 },
        { name: 'Licences Requested', month: 'September', value: 15 },
        { name: 'Licences Issued', month: 'Jan', value: 1 },
        { name: 'Licences Issued', month: 'Feb', value: 4 },
        { name: 'Licences Issued', month: 'March', value: 5 },
        { name: 'Licences Issued', month: 'April', value: 5 },
        { name: 'Licences Issued', month: 'May', value: 3 },
        { name: 'Licences Issued', month: 'June', value: 6 },
        { name: 'Licences Issued', month: 'July', value: 7 },
        { name: 'Licences Issued', month: 'August', value: 9 },
        { name: 'Licences Issued', month: 'September', value: 11 }
      ],
      configLicenceRequestedVsLicenceIssued: {
        height: 350,
        isGroup: true,
        xField: 'month',
        yField: 'value',
        seriesField: 'name',
        dodgePadding: 2,
        intervalPadding: 20,
        label: {
          position: 'middle', // 'top', 'middle', 'bottom'
          layout: [
            { type: 'interval-adjust-position' },
            { type: 'interval-hide-overlap' },
            { type: 'adjust-color' }
          ]
        },
        theme: {
          styleSheet: {
            brandColor: '#36a3f7',
            paletteQualitative10: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26']
          }
        }
      },

      config: {
        height: 350,
        autoFit: true,
        xField: 'year',
        yField: 'value',
        smooth: true
      },
      config3: {
        height: 350,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
          type: 'time'
        },
        yAxis: {
          label: {
            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
          }
        }
      },
      data3: [
        { month: '2019', value: 23000000 },
        { month: 'Jan', value: 2200000 },
        { month: 'Feb', value: -4600000 },
        { month: 'Mar', value: -9100000 },
        { month: 'Apr', value: 3700000 },
        { month: 'May', value: -2100000 },
        { month: 'Jun', value: 5300000 },
        { month: 'Jul', value: 3100000 },
        { month: 'Aug', value: -1500000 },
        { month: 'Sep', value: 4200000 },
        { month: 'Oct', value: 5300000 },
        { month: 'Nov', value: -1500000 },
        { month: 'Dec', value: 5100000 }
      ],
      config4: {
        height: 350,
        padding: 'auto',
        appendPadding: [20, 0, 0, 0],
        xField: 'month',
        yField: 'value',
        meta: {
          month: {
            alias: 'Month'
          },
          value: {
            alias: 'Revenue',
            formatter: (v) => `${v / 1_000_000} Mil.`
          }
        },
        total: {
          label: '2020'
        },
        color: ({ month, value }) => {
          if (month === '2019' || month === '2020') {
            return '#96a6a6'
          }
          return value < 0 ? '#F56C6C' : '#67C23A'
        },
        legend: {
          custom: true,
          items: [
            {
              name: 'Increase',
              value: 'increase',
              marker: { symbol: 'square', style: { r: 5, fill: '#67C23A' }}
            },
            {
              name: 'Decrease',
              value: 'decrease',
              marker: { symbol: 'square', style: { r: 5, fill: '#F56C6C' }}
            },
            {
              name: 'Total',
              value: 'total',
              marker: { symbol: 'square', style: { r: 5, fill: '#909399' }}
            }
          ]
        },
        label: {
          style: {
            fontSize: 10
          },
          layout: [{ type: 'interval-adjust-position' }],
          background: {
            style: {
              fill: '#f6f6f6',
              stroke: '#e6e6e6',
              strokeOpacity: 0.65,
              radius: 2
            },
            padding: 1.5
          }
        },
        waterfallStyle: () => {
          return {
            fillOpacity: 0.85
          }
        }
      },
      configurations: {
        height: 350,
        padding: 'auto',
        xField: 'Date',
        yField: 'scales',
        xAxis: {
          tickCount: 5
        },
        slider: {
          start: 0.1,
          end: 0.5
        }
      },
      data6: [
        { type: 'Individual Licences', value: 27 },
        { type: 'Numbering Licences', value: 25 },
        { type: 'Class Licences', value: 18 },
        { type: 'Type Approval', value: 15 }
      ],
      dataPieLicencePerCategory: [
        { type: 'Individual Licences', value: 27 },
        { type: 'Numbering Licences', value: 25 },
        { type: 'Class Licences', value: 18 },
        { type: 'Type Approval', value: 15 }
      ],
      config5: {
        height: 230,
        appendPadding: 5,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        legend: {
          layout: 'vertical',
          position: 'right'
        },
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 10
          }
        },
        meta: {
          value: {
            alias: 'Revenue',
            formatter: (v) => `${v * 10} Mil. TZS`
          }
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 16
            },
            formatter: () => 'Revenue Per Category (Mil TZS)'
          }
        }
      },
      configPieLicencePerCategory: {
        height: 230,
        appendPadding: 5,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        legend: {
          layout: 'vertical',
          position: 'right'
        },
        meta: {
          value: {
            alias: 'Revenue',
            formatter: (v) => `${v * 10} Thousand.`
          }
        },
        theme: {
          styleSheet: {
            brandColor: '#FF4500',
            paletteQualitative10: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26'],
            paletteQualitative20: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26', '#946DFF', '#6C3E00', '#6193FF', '#FF988E', '#36BCCB', '#004988', '#FFCF9D', '#CCDC8A', '#8D00A1', '#1CC25E']
          }
        },
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 10
          }
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 16
            },
            formatter: () => 'Licences Per Category'
          }
        }
      },
      chartData: dummyData3,
      activeName: 'first'
      // { 'colors10': ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'], 'colors20': ['#5B8FF9', '#CDDDFD', '#61DDAA', '#CDF3E4', '#65789B', '#CED4DE', '#F6BD16', '#FCEBB9', '#7262fd', '#D3CEFD', '#78D3F8', '#D3EEF9', '#9661BC', '#DECFEA', '#F6903D', '#FFE0C7', '#008685', '#BBDEDE', '#F08BB4', '#FFE0ED'] },
      // { 'colors102': ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'], 'colors20': ['#5B8FF9', '#CDDDFD', '#61DDAA', '#CDF3E4', '#65789B', '#CED4DE', '#F6BD16', '#FCEBB9', '#7262fd', '#D3CEFD', '#78D3F8', '#D3EEF9', '#9661BC', '#DECFEA', '#F6903D', '#FFE0C7', '#008685', '#BBDEDE', '#F08BB4', '#FFE0ED'] }

    }
  },
  methods: {

    handleConfigChange() {
      this.config.smooth = !this.config.smooth
    },
    handleSetLineChartData(chartType) {
      console.log(chartType)
    },
    handleDataChange() {
      this.data = [
        ...this.data,
        {
          year: (+this.data[this.data.length - 1].year + 1).toString(),
          value: 10 + +(Math.random() * 10).toFixed(0)
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>

.divider-custom{
  margin: 10px 0 !important;
}
.card-row-2{
  margin-top: 0.2em;
  font-size: 2em;
}
.card-row-3 {
  //display: block;
  //margin: 20px 10px !important;
  padding-top: 20px;
  font-size: 1em;
  margin-block-start: 1.67em;
  margin-block-end: 1.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  //font-weight: bold;
}

.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.panel-group {
  margin-top: 10px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    min-height: 108px;
    cursor: pointer;
    font-size: 1.5rem;
    //position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 2.2rem;
    }

    .font-size-big {
      float: left;
      font-size: 2.2rem;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 1rem;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 1.2rem;
      }
    }
  }
}

.panel-group-2 {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 1.5rem;
    //position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    margin-right: 5px;
    margin-bottom: 10px;
    margin-left: 5px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 2.2rem;
    }

    .font-size-big {
      float: left;
      font-size: 2.2rem;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 1rem;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 1.2rem;
      }
    }
  }
}

//@media (max-width:550px) {
//  .card-panel-description {
//    display: none;
//  }
//
//  .card-panel-icon-wrapper {
//    float: none !important;
//    width: 100%;
//    height: 100%;
//    margin: 0 !important;
//
//    .svg-icon {
//      display: block;
//      margin: 14px auto !important;
//      float: none !important;
//    }
//  }
//}
</style>
