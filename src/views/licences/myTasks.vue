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
        class="filter-item"
        size="mini"
        style=" margin-left: 10px"
      >
        <el-option
          v-for="item in filterList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <!--      <el-select-->
      <!--        v-model="listQuery.status"-->
      <!--        placeholder="Cargo Status"-->
      <!--        clearable-->
      <!--        class="filter-item"-->
      <!--        style="width: 130px; margin-left: 10px"-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in CargoStatus"-->
      <!--          :key="item.key"-->
      <!--          :label="item.name"-->
      <!--          :value="item.key"-->
      <!--        />-->
      <!--      </el-select>-->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
      >
        <div style="text-align: right; margin: 0">
          <span style="float:left; "> Send Notification for cargo?</span>
          <el-button size="mini" type="text" @click="visible = false">cancel</el-button>
          <el-button type="primary" size="mini" @click="handleConsolidation">confirm</el-button>
        </div>
        <el-table :data="multipleSelection">
          <el-table-column width="150" property="name" label="Client Name" />
          <el-table-column width="320" property="ref" label="Reference No. " />
        </el-table>
        <el-button
          v-show="hasCargoSelection"
          slot="reference"
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-bell"
        >
          Update Status
        </el-button>
      </el-popover>
    </div>
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
          {{ page.number !== 0 ? Math.abs((page.number - 1) * page.size + scope.$index + 1) : ( scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.entityName }}
        </template>
      </el-table-column>
      <el-table-column label="Licence">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Date Created">
        <template slot-scope="scope">
          <span>{{ scope.row.submittedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleView(row)">
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
import { getLicencePageable, getMYLicenceTasks } from '@/api/licences'
import pagination from '@/components/Pagination'
import { getLicenceCategories } from '@/utils/auth'
export default {
  name: 'MyTasks',
  components: {
    pagination
  },
  filters: {
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
        title: ''
      },
      pageNumber: 0,
      pageSize: 15,
      page: {
        // size: 1,
        size: 10,
        totalElements: 15,
        totalPages: 2,
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
    // this.licenceType = this.$route.path.split('/')[1].replace('-', '')
    // this.currentLicenceCategoryLabel = this.$route.meta.licenceCategory
    // console.log(this.$route.meta.licenceCategory)
    // console.log(this.currentLicenceCategoryLabel)
    // this.getLicenceCategoryDetailsByCode(this.currentLicenceCategoryLabel)
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
      getMYLicenceTasks(this.page.number, this.page.size).then(response => {
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
            message: 'No tasks available',
            showClose: true,
            type: 'success'
          })
        }
      }).catch(e => {
      })
    },
    handleView(data) {
      const hashed_id = encodeHashId(data.id)
      this.$router.push({ name: 'allLicenceDetails',
        params: { userHash: hashed_id, selectedLicenceType: data.categoryName }})
    },
    handleModifyStatus(data) {
    },
    handleFilter() {

    },
    handleCreate() {

    },
    handleConsolidation() {

    }

  }
}
</script>
