<!--<template>-->
<!--  <div>-->
<!--    <button @click="handleConfigChange">change config</button>-->
<!--    <button @click="handleDataChange">change data</button>-->
<!--    <PieChart ref="chartRef" v-bind="configPieLicencePerCategory" :data="dataPieLicencePerCategory" />-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--import { defineComponent, ref } from '@vue/composition-api'-->
<!--import { LineChart, PieChart } from '@opd/g2plot-vue'-->

<!--export default defineComponent({-->
<!--  name: 'LineChartDemo',-->
<!--  components: {-->
<!--    LineChart,-->
<!--    PieChart-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      data: [-->
<!--        { year: '1991', value: 3 },-->
<!--        { year: '1992', value: 4 },-->
<!--        { year: '1993', value: 3.5 },-->
<!--        { year: '1994', value: 5 },-->
<!--        { year: '1995', value: 4.9 },-->
<!--        { year: '1996', value: 6 },-->
<!--        { year: '1997', value: 7 },-->
<!--        { year: '1998', value: 9 },-->
<!--        { year: '1999', value: 11 }-->
<!--      ],-->
<!--      configPieLicencePerCategory: {-->
<!--        height: 230,-->
<!--        appendPadding: 5,-->
<!--        angleField: 'value',-->
<!--        colorField: 'type',-->
<!--        radius: 1,-->
<!--        innerRadius: 0.6,-->
<!--        legend: {-->
<!--          layout: 'vertical',-->
<!--          position: 'right'-->
<!--        },-->
<!--        meta: {-->
<!--          value: {-->
<!--            alias: 'Revenue',-->
<!--            formatter: (v) => `${v * 10} Thousand.`-->
<!--          }-->
<!--        },-->
<!--        theme: {-->
<!--          styleSheet: {-->
<!--            brandColor: '#FF4500',-->
<!--            paletteQualitative10: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26'],-->
<!--            paletteQualitative20: ['#FF4500', '#1AAF8B', '#406C85', '#F6BD16', '#B40F0F', '#2FB8FC', '#4435FF', '#FF5CA2', '#BBE800', '#FE8A26', '#946DFF', '#6C3E00', '#6193FF', '#FF988E', '#36BCCB', '#004988', '#FFCF9D', '#CCDC8A', '#8D00A1', '#1CC25E']-->
<!--          }-->
<!--        },-->
<!--        label: {-->
<!--          type: 'inner',-->
<!--          offset: '-50%',-->
<!--          content: '{value}',-->
<!--          style: {-->
<!--            textAlign: 'center',-->
<!--            fontSize: 10-->
<!--          }-->
<!--        },-->
<!--        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],-->
<!--        statistic: {-->
<!--          title: false,-->
<!--          content: {-->
<!--            style: {-->
<!--              whiteSpace: 'pre-wrap',-->
<!--              overflow: 'hidden',-->
<!--              textOverflow: 'ellipsis',-->
<!--              fontSize: 16-->
<!--            },-->
<!--            formatter: () => 'Licences Per Category'-->
<!--          }-->
<!--        }-->
<!--      },-->
<!--      dataPieLicencePerCategory: [-->
<!--        { type: 'Individual Licences', value: 27 },-->
<!--        { type: 'Numbering Licences', value: 25 },-->
<!--        { type: 'Class Licences', value: 18 },-->
<!--        { type: 'Type Approval', value: 15 }-->
<!--      ],-->
<!--      config: {-->
<!--        height: 350,-->
<!--        autoFit: true,-->
<!--        xField: 'year',-->
<!--        yField: 'value',-->
<!--        smooth: true-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    handleConfigChange() {-->
<!--      this.config.smooth = !this.config.smooth-->
<!--    },-->
<!--    handleDataChange() {-->
<!--      this.data = [-->
<!--        ...this.data,-->
<!--        {-->
<!--          year: (+this.data[this.data.length - 1].year + 1).toString(),-->
<!--          value: 10 + +(Math.random() * 10).toFixed(0)-->
<!--        }-->
<!--      ]-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    chartRef: function(val) {-->
<!--      var vm = this-->
<!--      console.log(val)-->
<!--      console.log(vm.$el)-->
<!--      // PDFObject.embed(val, vm.$el, this.options)-->
<!--    }-->
<!--  },-->
<!--  beforeUpdate() {-->
<!--    console.log(this.$refs.chartRef)-->
<!--  },-->
<!--  created() {-->
<!--    console.log(this.$refs.chartRef)-->
<!--  },-->
<!--  mounted() {-->
<!--    console.log(this.$refs.chartRef)-->
<!--    this.chartRef.value.on('click', (e) => {-->
<!--      console.log(e)-->
<!--    })-->
<!--  }-->
<!--})-->
<!--</script>-->

<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="12">
        <el-card>
          <v-chart class="chart" :option="option" :autoresize="true" @selectchanged="showData" />
        </el-card>
      </el-col>
      <el-col :md="12">
        <el-card>
          <v-chart class="chart" :option="barChartOption" @selectchanged="showData" />
          <v-chart class="chart" :option="option" @selectchanged="showData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  SVGRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])
// const theme = require('@/views/dashboard/theme.json')
export default {
  name: 'HelloWorld',
  components: {
    VChart
  },
  provide: {
    // [THEME_KEY]: theme

    //
    [THEME_KEY]: {
      // Global palette:
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],

      series: [{
        type: 'bar',
        // A palette only work for the series:
        color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42']
      },
      {
        type: 'pie',
        // A palette only work for the series:
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']
      }]
    }
  },
  data() {
    return {
      barChartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Forest', 'Steppe', 'Desert', 'Wetland']
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
            data: ['2012', '2013', '2014', '2015', '2016']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Forest',
            type: 'bar',
            barGap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390]
          },
          {
            name: 'Steppe',
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290]
          },
          {
            name: 'Desert',
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190]
          },
          {
            name: 'Wetland',
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: [98, 77, 101, 99, 40]
          }
        ]
      },
      option: {
        title: {
          text: 'Traffic Sources',
          left: 'center',
          textStyle: {
            // fontSize: 30,
            fontFamily: 'sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: [
            'Direct',
            'Email',
            'Ad Networks',
            'Video Ads',
            'Search Engines'
          ]
        },
        series: [
          {
            name: 'Traffic Sources',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [
              { value: 335, name: 'Direct' },
              { value: 310, name: 'Email' },
              { value: 234, name: 'Ad Networks' },
              { value: 135, name: 'Video Ads' },
              { value: 1548, name: 'Search Engines' }
            ]
            // emphasis: {
            //   itemStyle: {
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // }
          }
        ]
      }
    }
  },
  methods: {
    showData(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
