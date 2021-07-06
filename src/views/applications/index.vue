<template>
  <el-tabs v-model="activeName" class="tabs" stretch>
    <el-tab-pane label="Licence Applications" name="LIC">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        size="mini"
        highlight-current-row
      >
        <el-table-column label="#" align="center" width="50">
          <template slot-scope="scope">
            {{ IndexNumber(scope) }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" align="center">
          <template slot-scope="scope">
            {{ scope.row.applicationStage | filterStage }}
          </template>
        </el-table-column>
        <el-table-column label="Application Number">
          <template slot-scope="scope">
            {{ scope.row.applicationNumber }}
          </template>
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope">
            {{ scope.row.applicantEntityName }}
          </template>
        </el-table-column>
        <el-table-column label="Licence Product">
          <template slot-scope="scope">
            <span>{{ scope.row.licenseProduct }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Date Created">
          <template slot-scope="scope">
            <span>{{ scope.row.applicationDate.split('T')[0] }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="{row}">
            <el-button
              plain
              size="mini"
              type="primary"
              @click="handleView(row)"
            >
              Manage
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="page.totalElements"
        :page.sync="page.number"
        :limit.sync="page.size"
        @pagination="getNextData"
      />
    </el-tab-pane>
    <el-tab-pane label="Entity Applications" name="ENT">
      <entity-applications-index />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getLicenceApplications } from '@/api/reports'
import pagination from '@/components/Pagination'
import EntityApplicationsIndex from '@/views/entities/entityApplicationsIndex'
import { encodeHashId } from '@/utils'

export default {
  name: 'Index',
  components: {
    EntityApplicationsIndex,
    pagination
  },
  filters: {
    filterStage(data) {
      if (data === 'NEW') {
        return 'New'
      }
      if (data === 'INPROGRESS') {
        return 'In-Progress'
      } else {
        return data
      }
    }
  },
  data() {
    return {
      activeName: 'LIC',
      currentState: 'all',
      listLoading: false,
      list: [],
      listQuery: {
        title: '',
        type: 'All',
        showClear: false
      },
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 2,
        number: 0
      },
      newPage: true
    }
  },
  created() {
    this.fetchData(this.activeName)
    this.currentState = this.$route.meta.query
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
      getLicenceApplications(this.page.number, this.page.size, this.listQuery.title).then(response => {
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
          this.filterPageData(response.data.page)
        } else {
          this.$message({
            message: 'No data found',
            showClose: true,
            type: 'info'
          })
        }
      }).catch(_ => {
      })
    },
    handleView(data) {
      const licence = encodeHashId(data.id)
      this.$router.push({ name: 'allLicenceDetails',
        params: { userHash: licence, selectedLicenceType: 'LICENCE' }})
    }
  }
}
</script>

<style scoped>
.tabs {
  margin: 20px 20px;
}
</style>
