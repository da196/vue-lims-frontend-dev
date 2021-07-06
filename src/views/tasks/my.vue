<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        :placeholder="'Licence Category'"
        clearable
        size="mini"
        class="filter-item"
        style=" margin-left: 10px"
      >
        <el-option
          v-for="item in filterList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-button
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        v-if="listQuery.showClear"
        plain
        size="mini"
        class="filter-item"
        style="margin-left: 10px"
        type="info"
        icon="el-icon-minus"
        @click="handleClearQuery"
      >
        Clear
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      size="mini"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column label="#" align="center" width="50">
        <template slot-scope="scope">
          {{ page.number !== 0 ? Math.abs((page.number - 1) * page.size + scope.$index + 1) : ( scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column label="Activity Name">
        <template slot-scope="scope">
          {{ scope.row.taskName | defaultNull }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Date Created">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="dueDate" label="Due Date">
        <template slot-scope="scope">
          <span>{{ scope.row.dueDate | defaultNull }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width" width="150">
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
  </div>
</template>

<script>

import { encodeHashId } from '@/utils'
import { getMyTasks } from '@/api/tasks'
import pagination from '@/components/Pagination'
import { getLicenceCategories } from '@/utils/auth'
import { defaultNull } from '@/filters'
export default {
  name: 'MyTasks',
  components: {
    pagination
  },
  filters: {
    defaultNull,
    statusFilter(status) {
      const statusMap = {
        active: 'success',
        draft: 'gray',
        expired: 'warning',
        rejected: 'danger',
        incomplete: 'grey'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        title: '',
        showClear: false
      },
      pageNumber: 0,
      pageSize: 15,
      page: {
        // size: 1,
        size: 10,
        totalElements: 9,
        totalPages: 1,
        number: 0
      },
      IndividualLicenseTypes: [
        { key: 'NFL', value: 'Network Facilities Licences' },
        { key: 'NSL', value: 'Network Services Licences' },
        { key: 'ASL', value: 'Application Services Licences' },
        { key: 'CSL', value: 'Content Services Licences' }
      ],
      NumberingLicenseTypes: [
      ],
      ClassLicenceTypes: [],
      TypeApprovalTypes: [],
      AllLicenceTypes: [],

      multipleSelection: [],
      hasCargoSelection: false,
      downloadLoading: false,
      filterList: [],
      currentLicenceCategoryLabel: 'ALL',
      currentLicenceCategory: {
        id: 0
      },
      newPage: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    getLicenceCategoryDetailsByCode(code) {
      const licenceCategory = getLicenceCategories()
      if (code !== 'ALL') {
        this.currentLicenceCategory = licenceCategory.filter(e => e.code === code)[0]
      } else {
        this.currentLicenceCategory = {
          id: 0
        }
      }
    },

    getNextData() {
      if (this.page.number > 0) {
        this.page.number = this.page.number - 1
      }
      this.fetchData()
      this.page.number += 1
    },
    fetchData() {
      this.listLoading = true
      getMyTasks(this.page.number, this.page.size, this.listQuery.title).then(response => {
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
          if (this.newPage) {
            this.page = response.data.page
            this.newPage = false
          } else {
            this.page.number = response.data.page.number += 1
          }
        } else {
          this.list = []
          this.$message({
            message: 'No activities available',
            showClose: true,
            type: 'success'
          })
        }
      }).catch(e => {
      })
    },
    handleView(data) {
      const hashed_id = encodeHashId(data.id)
      const applicationId = encodeHashId(data.trackableId)
      this.$router.push({ name: 'MyDetails',
        params: { applicationId: applicationId, selectedLicenceType: data.trackableType ?? 'ENTITY', taskHash: hashed_id }})
    },
    handleFilter() {
      this.listQuery.showClear = true
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
    },
    handleClearQuery() {
      this.listQuery.showClear = false
      this.listQuery.title = ''
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
    }
  }
}
</script>
