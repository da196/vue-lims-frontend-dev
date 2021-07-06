<template>
  <el-card class="dashboard-card">
    <el-row style="margin-bottom: 10px">
      <span style="color: #606266; cursor:pointer;" class="on-hover" @click.prevent="clickContent">{{ heading }}</span>
      <el-popover
        v-if="descriptionContent || descriptionTitle"
        placement="top"
        :title="descriptionTitle"
        trigger="hover"
        :content="descriptionContent"
      >
        <i slot="reference" style="float: right; cursor: pointer" class="el-icon-question" />
      </el-popover>
    </el-row>
    <el-row>
      <span class="card-row-2 on-hover" style="cursor:pointer;" @click.prevent="clickContent"> {{ content }} </span>
      <br>
      <br>
      <span class="card-row-3">
        <slot name="subContent" />
        {{ subContent1 }}<i v-if="subContent1" :class="iconType()" /> &nbsp;
        {{ subContent2 }}<i v-if="subContent2" :class="iconType2()" />
      </span>
      <el-divider v-if="footerContent.length > 0" class="divider-custom" style="margin:10px" />
      <slot name="footer">
        <span class="on-hover" style="font-size: 14px; cursor: pointer" @click.prevent="footerClickEvent" v-html="footerContent" />
      </slot>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    heading: {
      type: String,
      default: () => ''
    },
    descriptionTitle: {
      type: String,
      default: () => ''
    },
    descriptionContent: {
      type: String,
      default: () => ''
    },
    descriptionWidth: {
      type: Number,
      default: () => 200
    },
    content: {
      type: String,
      default: () => 0
    },
    subContent1: {
      type: String,
      default: () => 0
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
      colorKeys: [
        { key: 'success', value: '#67C23A' },
        { key: 'warning', value: '#E6A23C' },
        { key: 'danger', value: '#F56C6C' },
        { key: 'info', value: '#909399' },
        { key: 'primary', value: '#409EFF' }]
    }
  },
  methods: {
    iconType() {
      return this.icon + ' ' + this.iconColorType
    },
    iconType2() {
      return this.icon2 + ' ' + this.iconColorType2
    },
    iconColor() {
      return this.colorKeys.filter(e => e.key === this.iconColorType)[0].value
    },
    footerClickEvent() {
      return this.$emit('subContentClicked', this.tag)
    },
    clickContent() {
      return this.$emit('subContentClicked', this.tag)
    }
  }
}
</script>

<style scoped lang="scss">
.on-hover:hover {
  color: #0876ef;
  //background: #c6c5c5;
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
.divider-custom{
  margin: 10px 0 !important;
}
.success {
  color:#67C23A
}
.warning {
color: #E6A23C
}
.danger {
color: #F56C6C
}
.info {
color: #909399
}
.primary {
  color: #409EFF
}

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
