<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        v-permission="['ROLE_LICENSE_VIEW_PRESENTATIONS']"
        placeholder="Search by name, code"
        style="width: 20rem"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-permission="['ROLE_LICENSE_VIEW_PRESENTATIONS']"
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
        v-permission="['ROLE_LICENSE_VIEW_PRESENTATIONS']"
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
      v-permission="['ROLE_LICENSE_VIEW_PRESENTATIONS']"
      :data="list"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ indexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Application Ref. No." align="center">
        <template slot-scope="scope">
          {{ scope.row.applicationNumber }}
        </template>
      </el-table-column>
      <el-table-column label="Applicant Entity Name" prop="applicantEntityName" />
      <el-table-column label="Presentation Date" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.presentationDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Product" align="center" prop="productName" />
      <!--      <el-table-column type="expand" label="Attachments" align="center" width="120">-->
      <!--        <template slot-scope="props">-->
      <!--          <p><b>Attachments:</b></p>-->
      <!--          <div>-->
      <!--            <p />-->
      <!--          </div>-->
      <!--          <p v-for="(i, index) in props.row.attachments" :key="i.id">-->
      <!--            {{ index +1 }}. {{ i.name }}-->
      <!--            <el-button-->
      <!--              plain-->
      <!--              size="mini"-->
      <!--              type="primary"-->
      <!--              style="margin-left: 20px"-->
      <!--              @click.prevent="viewPdf(i)"-->
      <!--            > View </el-button> </p>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="Action" align="center" prop="action">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="viewApplication(scope.row)"
          >
            View Presentation
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-permission="['ROLE_VIEW_PRESENTATION_ATTACHMENT', 'ROLE_LICENSE_VIEW_PRESENTATIONS']"
      :total="page.totalElements"
      :page.sync="page.number"
      :limit.sync="page.size"
      @pagination="getNextData"
    />
    <el-drawer
      v-loading="presentationLoading"
      :visible.sync="showPresentationDrawer"
      direction="ltr"
      :wrapper-closable="false"
      size="80%"
      :title="attachment.name"
    >
      <el-row>
        <pdfViewer height="85vh" :url="attachment.base64" :uri="attachment.uri" />
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import pdfViewer from '@/components/pdfViewer/pdfViewer'
import { getListOfPresentations, getPresentationAttachmentById } from '@/api/licences'
import pagination from '@/components/Pagination'
import { getObjectBase64 } from '@/utils/minio'

export default {
  name: 'AllPresentations',
  components: {
    pdfViewer,
    pagination
  },
  data() {
    return {
      activeName: 'All Presentations',
      drawer: false,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: '',
        type: undefined,
        status: undefined,
        showClear: false
      },
      attachment: {
        name: '',
        url: '',
        uri: ''
      },
      pdfUrl: '',
      // Pagination
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      showPresentationDrawer: false,
      presentationLoading: false,
      presentationDetails: {}

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    indexNumber(scope) {
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
      getListOfPresentations(this.page.number, this.page.size, this.listQuery.title).then(response => {
        this.listLoading = false
        this.list = response.data.content
        if (response.data) {
          this.filterPageData(response.data.page)
        }
      }).catch(_ => {
        this.list = []
        this.listLoading = false
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
    },
    viewPdf(data) {
      this.attachment.pdfUrl = data.link
      this.attachment.name = data.name
      // this.pdfUrl = data.link
      this.drawer = true
    },

    viewApplication(data) {
      this.showPresentationDrawer = true
      this.presentationLoading = true

      this.getDetailsById(data.id)
    },
    getDetailsById(id) {
      this.presentationLoading = true
      getPresentationAttachmentById(id).then(response => {
        this.presentationDetails = response.data
        this.attachment = this.presentationDetails
        this.attachment.name = this.presentationDetails.attachmentTypeName
        this.attachmentLoading = true
        getObjectBase64(this.attachment.uri).then(response => {
          this.attachmentLoading = false
          this.attachment.base64 = response
          this.presentationLoading = false
        })
        this.attachment.pdfUrl = this.presentationDetails.uri
      }).catch(_ => {
        this.presentationLoading = false
      })
    }

  }

}
</script>

<style scoped>
</style>
