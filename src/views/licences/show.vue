<template>
  <div class="app-container">
    <div v-loading="listLoading">
      <el-row class="pb-2">
        <el-col :span="12" class="pl-3">
          <span class="dash_title">
            Ref. No.
          </span>
          <span>
            {{ licenceDetails.licenceNumber | defaultNull }}
          </span>
        </el-col>
        <el-col :span="12" style="text-align: right;" class="pr-3">
          <span class="dash_title">
            Application Type:
          </span>
          <span class="success-text">
            {{ licenceDetails.applicationState }}
          </span>

        </el-col>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Applicant Details" name="first">
            <application-details application-type="LICENCE" :licence-id="licenceId" :licence-details="licenceDetails" @requestPageRefresh="refreshPage" @viewGeneratedLicence="viewGeneratedLicence" />
          </el-tab-pane>

          <el-tab-pane v-if="attachmentsPresent" label="Application Attachments" name="second">
            <el-row>
              <h4 style="text-decoration: underline;">Attachments List</h4>
              <el-table
                v-loading="false"
                :data="licenceDetails.attachments"
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
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="licenceDetails.activities.length > 0" label="Application Timeline" name="third">

            <el-timeline :reverse="true">
              <el-timeline-item v-for="(item, index) in licenceDetails.activities" :key="index" :timestamp="item.createdAt" placement="top">
                <el-row>
                  <p><b> Activity Name: </b> {{ item.activityName }}</p>
                  <p><b> Acted By: </b> {{ filterName(item.actor) }}</p>
                  <p><b> Decision Made: </b> {{ item.decision | DecisionFilter }}</p>
                  <p><b> Comments: </b> {{ item.comments }}</p>
                  <p v-if="item.form"><b> Forms: </b>{{ item.form.name }}   <el-button plain size="mini" style="margin-left: 2rem" icon="el-icon-view" type="primary" @click.prevent="viewForm(item.form)"> View </el-button></p>
                  <p v-if="item.attachments.length > 0"> <b>Attachments:</b>
                    <span v-for="a in item.attachments" :key="a.id">
                      {{ filterAttachment(a) }}
                      <el-button plain size="mini" style="margin-left: 2rem" icon="el-icon-view" type="primary" @click.prevent="viewAttachment(a)"> View Attachment </el-button>
                    </span>
                  </p>
                </el-row>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
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
    <el-dialog :visible.sync="viewFormDialog" title="Form Details" width="85vw" center>
      <dynamic-form :form-details="viewFormDialogData" :show-save-draft-button="false" />
    </el-dialog>

  </div>
</template>

<script>
import { DecisionFilter, statusFilter, toThousandFilter, defaultNull } from '@/filters'
import { decodeHashId } from '@/utils'
import pdfViewer from '@/components/pdfViewer/pdfViewer'
import { getObjectBase64 } from '@/utils/minio'
import { getLicenceById, initiateCancellationOfLicence } from '@/api/licences'
import dynamicForm from '@/views/tasks/forms/dynamicForm'
import { statusCodes } from '@/utils/status-codes'
import { findEntityApplicationById } from '@/api/entities'
import ApplicationDetails from '@/views/tasks/subComponents/applicationDetails'

export default {
  components: {
    ApplicationDetails,
    pdfViewer,
    dynamicForm
  },
  filters: {
    statusFilter,
    toThousandFilter,
    defaultNull,
    DecisionFilter,
    filterList(Data) {
      return Data.toString()
    },
    licenceTypeFilter(status) {
      const statusMap = {
        individuallicences: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {

      activeName: 'first',
      list: null,
      listLoading: true,
      listLoading2: false,
      attachment: {
        name: '',
        uri: '',
        id: ''
      },
      showDrawer: false,
      attachmentLoading: false,
      viewFormDialog: false,
      viewFormDialogData: [],
      serviceType: '',
      licenceId: '',
      services: [
        {
          licenseGroupName: 'Individual License',
          licenceName: 'Network Facility License',
          serviceName: 'Cabling',
          serviceLevel: 'International',
          serviceCoverage: []
        },
        {
          licenseGroupName: 'Individual License',
          licenceName: 'Network Facility License',
          serviceName: 'Network Service',
          serviceLevel: 'District',
          serviceCoverage: ['ARS', 'MWZ', 'DAR']
        }
      ],
      showMoreDetails: false,
      showMoreDetails2: false,
      share_capital_value: 21000000000,
      share_capital_currency: 'TZS',
      licenceDetails: {
        id: '',
        licenseCurrentState: 'NEW',
        product: '',
        coverageAreas: [],
        issueDate: null,
        expireDate: null,
        services: [],
        individual: {
          resources: []
        },
        submittedAt: '',
        bills: [],
        activities: [],
        entity: {
          name: '',
          phone: '',
          email: '',
          fax: '',
          website: '',
          physicalAddress: '',
          postalAddress: '',
          postalCode: null,
          country: null,
          region: '',
          district: '',
          ward: null,
          businessLicenceNo: '',
          regCertNo: '',
          tinNo: '',
          category: 0,
          categoryName: '',
          shareholders: [],
          spectrumValues: []
        }
      },
      licenceDetailsAndTasks: [],
      licenceForms: {},
      licenceTaskInformation: [],
      availableActors: [],
      decisions: [],
      showTaskTab: false,
      taskId: ''
    }
  },
  computed: {
    attachmentsPresent() {
      return this.licenceDetails?.attachments?.length > 0
    },
    globalLoading() {
      console.log(this.listLoading)
      console.log(this.listLoading2)
      return this.listLoading && this.listLoading2
    }
  },
  created() {
    this.serviceType = this.$route.params.selectedLicenceType
    this.licenceId = this.$route.params.userHash
    // this.taskId = this.$route.params.taskHash

    // this.taskId = decodeHashId(this.taskId)[0]
    this.licenceId = decodeHashId(this.licenceId)[0]
    this.fetchData()
    // if (this.taskId) {
    //   this.getAssociatedTasks()
    // }
    // this.customActivityTimeline()
    //         'APPROVE',
  },
  methods: {
    customActivityTimeline() {
      this.licenceDetails.activities = this.licenceDetails.activities.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    },
    mapCoverageAreas() {
      return this.licenceDetails.coverageAreas?.map(e => e.name)
    },
    refreshPage() {
      this.activeName = 'first'
      this.fetchData()
    },

    getLicenceDetails() {
      getLicenceById(this.licenceId).then(response => {
        this.listLoading = true
        if (response.data) {
          this.licenceDetails = response.data
          this.listLoading = false
        } else {
          this.$message({
            message: response.message,
            type: 'warning',
            duration: 5000,
            showClose: true
          })
          this.listLoading = false
        }
      }).catch(_ => {
        this.listLoading = false
      })
    },
    getEntityDetails() {
      findEntityApplicationById(this.licenceId).then(response => {
        if (response.data) {
          this.licenceDetails = response.data
          this.listLoading = false
        } else {
          this.$message({
            message: response.message,
            type: 'warning',
            duration: 5000,
            showClose: true
          })
          this.listLoading = false
        }
      }).catch(_ => {
        this.listLoading = false
      })
    },

    fetchData() {
      this.listLoading = true
      getLicenceById(this.licenceId).then(response => {
        this.listLoading = true
        if (response.data) {
          this.licenceDetails = response.data
          this.listLoading = false
          this.customActivityTimeline()
        } else {
          this.$message({
            message: response.message,
            type: 'warning',
            duration: 5000,
            showClose: true
          })
          this.listLoading = false
        }
      }).catch(_ => {
        this.listLoading = false
      })
    },
    filterAttachment(item) {
      return item?.attachmentTypeName
    },
    viewGeneratedLicence(data) {
      console.log(data)
      this.attachment.pdfUri = data
      this.attachment.name = `Licence for ${this.licenceDetails?.entity?.name}`
      this.attachmentLoading = true
      getObjectBase64(data).then(response => {
        this.attachmentLoading = false
        this.attachment.base64 = response
        this.showDrawer = true
      })
      this.showDrawer = true
    },
    filterName(item) {
      const lastName = item.lastName ?? ''
      const middleName = item.middleName ?? ''
      const firstName = item.firstName ?? ''
      return firstName + ' ' + middleName + ' ' + lastName
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
    },
    viewForm(data) {
      this.viewFormDialog = true
      this.viewFormDialogData = data
    },
    initiateLicenceCancellation() {
      this.viewCancellationDialog = true
    },
    submitCancellation() {
      this.viewCancellationDialog = false
      this.cancellationForm.licenceId = this.licenceId
      this.$refs['cancellationForm'].validate((valid) => {
        if (valid) {
          initiateCancellationOfLicence(this.cancellationForm).then(response => {
            if (response.code === statusCodes.SUCCESS) {
              this.$message({
                message: 'Cancellation initiated successfully',
                type: 'warning',
                duration: 5000,
                showClose: true
              })
              this.fetchData()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
