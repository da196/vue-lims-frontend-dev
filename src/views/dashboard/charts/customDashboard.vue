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
      <!-- start -->
      <el-button class="card-row-2 on-hover" style="cursor:pointer;" type="text" @click="dialogTableVisible = true">{{ content }}</el-button>
      <el-dialog
        :title="titleDialog"
        :visible.sync="dialogTableVisible"
        width="60%"
      >
        <el-input
          v-model="search"
          style="width: 400px"
          placeholder="Type to search"
          class="filter-item"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
        <el-table :data="statusFilter" height="500">
          <el-table-column type="index" label="#" width="50" />
          <el-table-column property="applicationNumber" label="APPL/NO" width="300" />
          <el-table-column property="applicantEntityName" label="APPLICANT" width="200" />
          <el-table-column property="licenseProduct" label="LICENCE PRODUCT" width="600" />
        </el-table>
      </el-dialog>
      <!-- end -->
      <br>
      <el-divider v-if="footerContent.length > 0" class="divider-custom" style="margin:10px" />
      <slot name="footer">
        <span class="on-hover" style="font-size: 14px; cursor: pointer" @click.prevent="dialogStatusVisible = true" v-html="footerContent" />
        <el-dialog :visible.sync="dialogStatusVisible" width="60%" :title="titleDialog">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="labelOne" name="first">
              <el-input
                v-model="search"
                style="width: 400px"
                placeholder="Type to search"
                class="filter-item"
              >
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
              <el-table :data="newFilter" height="500">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column property="applicationNumber" label="APPL/NO" width="300" />
                <el-table-column property="applicantEntityName" label="APPLICANT" width="200" />
                <el-table-column property="licenseProduct" label="LICENCE PRODUCT" width="600" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="labelTwo" name="second">
              <el-input
                v-model="search"
                style="width: 400px"
                placeholder="Type to search"
                class="filter-item"
              >
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
              <el-table :data="inprogressFilter" height="500">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column property="applicationNumber" label="APPL/NO" width="300" />
                <el-table-column property="applicantEntityName" label="APPLICANT" width="200" />
                <el-table-column property="licenseProduct" label="LICENCE PRODUCT" width="600" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="labelThree" name="third">
              <el-input
                v-model="search"
                style="width: 400px"
                placeholder="Type to search"
                class="filter-item"
              >
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
              <el-table :data="ministryFilter" height="500">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column property="applicationNumber" label="APPL/NO" width="300" />
                <el-table-column property="applicantEntityName" label="APPLICANT" width="200" />
                <el-table-column property="licenseProduct" label="LICENCE PRODUCT" width="600" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </slot>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'CustomizeDashboard',
  props: {
    dialogTitle: {
      type: String,
      default: () => ''
    },
    heading: {
      type: String,
      default: () => ''
    },
    descriptionTitle: {
      type: String,
      default: () => ''
    },
    titleDialog: {
      type: String,
      default: () => ''
    },
    gridData: {
      type: Array,
      default: () => []
    },
    gridStatus1: {
      type: Array,
      default: () => []
    },
    gridStatus2: {
      type: Array,
      default: () => []
    },
    gridStatus3: {
      type: Array,
      default: () => []
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
      default: () => ''
    },
    footerContent: {
      type: String,
      default: () => ''
    },
    tag: {
      type: String,
      default: () => ''
    },

    labelOne: {
      type: String,
      default: () => ''
    },
    labelTwo: {
      type: String,
      default: () => ''
    },
    labelThree: {
      type: String,
      default: () => ''
    }

  },
  data() {
    return {
      activeName: 'first',
      search: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogStatusVisible: false
    }
  },
  computed: {
    statusFilter() {
      return this.gridData.filter(data => !this.search ||
          data.applicantEntityName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.applicationNumber.toLowerCase().includes(this.search.toLowerCase()))
    },
    newFilter() {
      return this.gridStatus1.filter(data => !this.search ||
          data.applicantEntityName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.applicationNumber.toLowerCase().includes(this.search.toLowerCase()))
    },
    inprogressFilter() {
      return this.gridStatus2.filter(data => !this.search ||
          data.applicantEntityName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.applicationNumber.toLowerCase().includes(this.search.toLowerCase()))
    },
    ministryFilter() {
      return this.gridStatus3.filter(data => !this.search ||
          data.applicantEntityName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.applicationNumber.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  created() {
    // TODO -- change the endpoint associated with the fetch data to change
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
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
