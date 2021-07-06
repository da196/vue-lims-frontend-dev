<template>
  <el-tabs v-model="activeName" class="tabs" stretch @tab-click="handleClick">
    <el-tab-pane label="Network Facilities Licence" name="NFL">
      <div style="margin: 20px 20px">
        Network Facilities Licence
      </div>
      <div class="">
        <IndividualLicenseTable />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Network Service Licence" name="NSL">Network Service Licence</el-tab-pane>
    <el-tab-pane label="Applications Service Licence" name="ASL">Applications Service Licence</el-tab-pane>
    <el-tab-pane label="Content Services" name="CSL">Content Services</el-tab-pane>
  </el-tabs>
</template>

<script>
import IndividualLicenseTable from './individualLicenseTable'
export default {
  name: 'Index',
  components: {
    IndividualLicenseTable
  },
  data() {
    return {
      activeName: 'NFL'
    }
  },
  created() {
    this.fetchLicenceApplications(this.activeName)
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      this.fetchLicenceApplications(this.activeName)
    },
    fetchLicenceApplications(licenceType) {
      console.log('to fetch licences for ' + licenceType)
    }
  }
}
</script>

<style scoped>
.tabs {
  margin: 20px 20px;
}
</style>
