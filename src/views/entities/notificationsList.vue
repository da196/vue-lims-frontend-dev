<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Search by name, group, phase"
        style="width: 20rem"
        class="filter-item"
        size="mini"
        @keyup.enter.native="handleFilter"
      />
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
      element-loading-text="Loading"
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ IndexNumber(scope) }}
        </template>
      </el-table-column>
      <el-table-column label="Entity Name" prop="entityName" align="left" />
      <el-table-column label="Notification Category" prop="categoryName" align="left" />
      <el-table-column label="Date Created" prop="createdAt" align="left" />
      <el-table-column label="Action" align="center" prop="action" width="200rem">
        <template slot-scope="scope">
          <el-button
            v-permission="['ROLE_STATUS_EDIT']"
            plain
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >
            View Message
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

    <el-dialog :visible.sync="showEntityNotificationsDialog" :title="title" width="70%">
      <div v-loading="detailsLoading">
        <el-tabs :active-name="activeTab" stretch>
          <el-tab-pane label="Notification Details" name="notificationDetails">
            <div class="el-descriptions">
              <div class="el-descriptions__body">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <span class="el-descriptions__label">Entity Name</span>
                        <span class="el-descriptions__content">{{ entityNotifications.entityName | defaultNull }}</span>
                      </td>
                      <td>
                        <span class="el-descriptions__label">Entity Category Name </span>
                        <span class="el-descriptions__content"> {{ entityNotifications.category.name | defaultNull }} </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="el-descriptions__label">Message</span>
                        <span class="el-descriptions__content">{{ entityNotifications.message | defaultNull }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="Associated Attachments" name="associatedAttachments">
            <el-table
              v-loading="false"
              :data="entityNotifications.attachments"
              element-loading-text="Loading"
              fit
              highlight-current-row
            >
              <el-table-column label="ID" align="left" width="95">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="Attachment Name" align="left">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Attachment Type" align="left">
                <template slot-scope="scope">
                  {{ scope.row.attachmentTypeName }}
                </template>
              </el-table-column>
              <el-table-column label="Action">
                <template slot-scope="scope">
                  <el-button
                    plain
                    size="mini"

                    type="success"
                    @click="viewAttachment(scope.row)"
                  >
                    View Attachment
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

        </el-tabs>
      </div>
    </el-dialog>
    <el-drawer
      v-loading="attachmentLoading"
      :visible.sync="showDrawer"
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
import pagination from '@/components/Pagination'
import { defaultNull } from '@/filters'
import { getEntityNotificationsById, getEntityNotificationsPageable } from '@/api/licences'
import pdfViewer from '@/components/pdfViewer/pdfViewer'
import { getObjectBase64 } from '@/utils/minio'

export default {
  name: 'NotificationsList',
  filters: {
    defaultNull
  },
  components: {
    pagination,
    pdfViewer
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        type: '',
        status: '',
        sort: '+id',
        showClear: false
      },
      title: 'View Notification Details',
      list: null,
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showDrawer: false,
      attachment: {},
      attachmentLoading: false,
      showEntityNotificationsDialog: false,
      entityNotifications: {
        name: '',
        displayName: '',
        phase: '',
        categoryName: '',
        description: '',
        category: {},
        attachments: []
      },
      page: {
        size: 10,
        totalElements: 15,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      activeTab: 'notificationDetails',
      submissionLoading: false,
      actionType: 'create',
      detailsLoading: false
    }
  },
  created() {
    this.fetchData()
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
      getEntityNotificationsPageable(this.page.number, this.page.size, this.listQuery.title).then(response => {
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
    clearDialog() {
      this.title = ''
      this.submissionLoading = false
      this.showEntityNotificationsDialog = false
      this.entityNotifications = {
        name: '',
        displayName: '',
        phase: '',
        group: '',
        description: ''
      }
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
    handleView(data) {
      this.actionType = 'edit'
      this.title = 'View Notification Details'
      this.showEntityNotificationsDialog = true
      this.detailsLoading = true
      getEntityNotificationsById(data.id).then(response => {
        this.detailsLoading = false
        this.entityNotifications = response.data
      }).catch(_ => {
        this.detailsLoading = false
      })
      // this.
    },
    viewAttachment(data) {
      this.attachment = data
      this.attachment.name = data.attachmentTypeName
      this.attachmentLoading = true
      getObjectBase64(this.attachment.uri).then(response => {
        this.attachmentLoading = false
        this.attachment.base64 = response
        this.showDrawer = true
      })
      this.showDrawer = true
      this.attachment.pdfUrl = data.uri
    }
  }
}
</script>

<style scoped>

</style>
