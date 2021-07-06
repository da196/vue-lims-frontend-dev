<template>
  <div>
    <v-chart class="chart" :option="option" @selectchanged="elementClicked" />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  name: 'DashboardPieChart',
  provide: {
    // [THEME_KEY]: theme

    //
    [THEME_KEY]: {
      // Global palette:
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

      // series: [{
      //   type: 'bar',
      //   // A palette only work for the series:
      //   color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42']
      // },
      // {
      //   type: 'pie',
      //   // A palette only work for the series:
      //   color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']
      // }]
    }
  },
  components: {
    VChart
  },
  props: {
    heading: {
      type: String,
      default: () => ''
    },
    legendList: {
      type: Array,
      default: () => []
    },
    content: {
      type: Array,
      default: () => []
    },
    descriptionWidth: {
      type: Number,
      default: () => 200
    },
    subContent1: {
      type: String,
      default: () => ''
    },
    subContent2: {
      type: String,
      default: () => ''
    },
    footerContent: {
      type: String,
      default: () => ''
    },
    icon: {
      type: String,
      default: () => 'el-icon-caret-top'
    },
    icon2: {
      type: String,
      default: () => 'el-icon-caret-top'
    },
    iconColorType: {
      type: String,
      default: () => 'success'
    },
    iconColorType2: {
      type: String,
      default: () => 'success'
    },
    tag: {
      type: String,
      default: () => ''
    }

  },
  data() {
    return {
      option: {
        title: {
          text: this.heading,
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
          data: this.legendList
        },
        series: [
          {
            name: this.heading,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
            },
            data: this.content
            // data: [
            //   { value: 335, name: 'Direct' },
            //   { value: 310, name: 'Email' },
            //   { value: 234, name: 'Ad Networks' },
            //   { value: 135, name: 'Video Ads' },
            //   { value: 1548, name: 'Search Engines' }
            // ]
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
    elementClicked(data) {
      return this.$emit('elementClicked', data)
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-card {
    &:hover {
       background: rgba(244, 244, 245, 0.73);
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
}

</style>
