<template>
  <div class="app-container">
    <div class="filter-container" />
    <el-table
      v-loading="listLoading"
      :data="responseData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    />
    <Pagination total="" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index'
export default {
  name: 'IndividualLicenseTable',
  components: {
    pagination
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableDataKeys: {
      type: Array,
      default: () => []
    },
    noDataFound: {
      type: Boolean,
      default: false
    },
    hasEditButton: {
      type: Boolean,
      default: false
    },
    hasManageButton: {
      type: Boolean,
      default: true
    },
    hasViewButton: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      listLoading: false,
      responseData: []
    }
  }
}
</script>

<style scoped>

</style>
