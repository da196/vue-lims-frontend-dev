<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, code"
        style="width: 20rem"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--      <el-select-->
      <!--        v-model="listQuery.type"-->
      <!--        placeholder="Cargo Type"-->
      <!--        clearable-->
      <!--        class="filter-item"-->
      <!--        style="width: 130px; margin-left: 10px"-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in CargoType"-->
      <!--          :key="item.key"-->
      <!--          :label="item.name"-->
      <!--          :value="item.key"-->
      <!--        />-->
      <!--      </el-select>-->
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
        plain
        size="mini"

        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        Add
      </el-button>
      <el-button
        plain
        size="mini"
        :loading="downloadLoading"
        class="filter-item"
        style="margin-right:10px"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button>

      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
      >
        <div style="text-align: right; margin: 0">
          <span style="float:left; "> Send Notification for cargo?</span>
          <el-button
            plain
            size="mini"
            type="text"
            @click="visible = false"
          >cancel</el-button>
          <el-button
            plain
            size="mini"
            type="primary"
            @click="handleConsolidation"
          >confirm</el-button>
        </div>
        <el-table :data="multipleSelection">
          <el-table-column width="150" property="name" label="Client Name" />
          <el-table-column width="320" property="ref" label="Reference No. " />
        </el-table>
        <el-button
          v-show="hasCargoSelection"
          slot="reference"
          plain
          size="mini"
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
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="ID" align="center" width="95">

        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="List Type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.list_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date Created" align="center" prop="created_at">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.date_created | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="Actions"-->
      <!--        align="center"-->
      <!--        class-name="small-padding"-->
      <!--      >-->
      <!--        <template slot-scope="{ row }">-->
      <!--          &lt;!&ndash; <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
      <!--            Edit-->
      <!--          </el-button> &ndash;&gt;-->
      <!--          <el-button-->
      <!--            v-if="row.status != 'published'"-->
      <!--            size="mini"-->
      <!--            type="success"-->
      <!--            @click="handleModifyStatus(row)"-->
      <!--          >-->
      <!--            Manage-->
      <!--          </el-button>-->
      <!--          <el-button size="mini" type="info" @click="handleModifyStatus(row)">-->
      <!--            View-->
      <!--          </el-button>-->
      <!--          &lt;!&ndash; <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">-->
      <!--            Delete-->
      <!--          </el-button> &ndash;&gt;-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <el-dialog :visible.sync="addClient" :title="title">
      <add />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  components: {

  },
  data() {
    return {
      licenceType: 'all',
      pageNumber: 1,
      pageSize: 30
    }
  },
  computed: {
    ...mapGetters('licenceApplications', ['getLicenseResponseList'])
  },
  created() {
    this.licenceType = this.$route
    console.log(this.licenceType)
    this.fetchLicenseDetails()
  },
  methods: {
    fetchLicenseDetails() {
      this.isLoading = true
      this.$store.dispatch('licenceApplications/getAll',
        (this.pageNumber, this.pageSize, this.licenceType)).then(() => {
        this.licenseData = this.getLicenseResponseList
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }

}
</script>

<style scoped>

</style>
