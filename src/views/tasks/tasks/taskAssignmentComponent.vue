<template>
  <div class="app-container">
    <el-row>
      <div class="el-descriptions">
        <div class="el-descriptions__header">
          <div>
            <h3 style="text-decoration: underline">  Activity Information</h3>
          </div>
          <div class="el-descriptions__extra" />
        </div>
        <div class="el-descriptions__body">
          <table class="">
            <tbody>
              <tr>
                <td colspan="2">
                  <span class="el-descriptions__label">Date Created:</span>
                  <span class="el-descriptions__content">{{ licenceDetails.licence ? licenceDetails.licence.track[0].createdAt : '' }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="el-descriptions__label">Activity Details</span>
                  <span class="el-descriptions__content">{{ licenceDetails.taskName }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <el-row style="margin-top: 5px !important;">
            <el-button
              plain
              size="mini"
              type="primary"
              style="float: right; margin-right: 20px"
              @click="filterActions"
            >
              Actions
              <i class="el-icon-more-outline" />
            </el-button>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="licenceForms">
      <h4 style="text-decoration: underline">Associated Forms</h4>
      <el-table
        v-loading="false"
        :data="availableForms"
        element-loading-text="Loading"
        size="mini"
        fit
        highlight-current-row
      >
        <el-table-column label="ID" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Form Name" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Form Description" align="left">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="Action" align="center" prop="action" width="250">
          <template slot-scope="scope">
            <el-button
              plain
              size="mini"
              type="primary"
              @click.prevent="showForm(scope.row)"
            > Continue Evaluation </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row v-if="licenceTaskInformation">
      <h4 style="text-decoration: underline">Previous Activities</h4>
      <el-table
        v-loading="false"
        :data="licenceTaskInformation"
        element-loading-text="Loading"
        fit
        size="mini"
        highlight-current-row
      >
        <el-table-column label="ID" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Activity Name" align="left">
          <template slot-scope="scope" style="word-break: break-word">
            <span>{{ scope.row.stepName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Assigned User" align="left">
          <template slot-scope="scope" style="word-break: break-word">
            {{ scope.row.actor }}
          </template>
        </el-table-column>
        <el-table-column label="Assigned Role" align="left">
          <template slot-scope="scope" style="word-break: break-word">
            {{ scope.row.actorRole ? scope.row.actorRole.name : 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column label="Completed?" align="center">
          <template slot-scope="scope">
            {{ scope.row.isActed ? 'YES' : 'NO' }}
          </template>
        </el-table-column>
        <el-table-column label="Date Created" align="left">
          <template slot-scope="scope">
            {{ scope.row.createdAt }}
          </template>
        </el-table-column>
        createdAt
      </el-table>
    </el-row>
    <el-dialog :visible.sync="assignmentDialog" :title="title">
      <el-form ref="assignmentDialog" :model="actionModel" :rules="actorsRequired" label-position="top">
        <el-form-item v-if="decisions.includes('ASSIGN')" label="Select Actors">
          <el-select
            v-model="actionModel.actors"
            clearable
            multiple
            filterable
            placeholder="Actors"
            style="min-width: 30vw"
            required
            prop="actors"
          >
            <el-option
              v-for="item in availableActors"
              :key="item.id"
              :value="item.id"
              :label="filterName(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Additional Details/Comments"
          required
          :rules="{required: true, message: 'Comments are required', trigger: 'blur' }"
          prop="comments"
        >
          <el-input v-model="actionModel.comments" clearable type="textarea" />
        </el-form-item>
        <el-form-item label="Due Date">
          <el-date-picker v-model="actionModel.dueDate" style="min-width: 30vw" type="datetime" placeholder="Select Due Date" :picker-options="datePickerOptions" />
        </el-form-item>

        <el-form-item
          v-if="decisions.includes('INVITE')"
          label="Presentation Date & Time"
          :rules="{required: true, message: 'The presentation date  required', trigger: 'blur' }"
        >
          <el-date-picker
            v-model="actionModel.presentationDate"
            placeholder="Select presentation date and time"
            style="min-width: 30vw"
            :picker-options="datePickerOptions"
            type="datetime"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="actionModel.hasAttachment">Add Attachment</el-checkbox>
        </el-form-item>
        <div v-if="actionModel.hasAttachment">
          <el-form-item label="Attachment Type">
            <el-select
              v-model="attachmentObject.attachmentType"
              clearable
              filterable
              placeholder="Attachment Type"
              style="min-width: 30vw"
              required
              prop="actors"
            >
              <el-option
                v-for="item in attachmentTypes"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Attachment Name">
            <el-input v-model="attachmentObject.name" />
          </el-form-item>
          <el-form-item v-if="actionModel.hasAttachment" label="Attachment">
            <el-upload
              ref="upload"
              class="upload-demo"
              action=""
              :on-change="handleUploadChange"
              :before-upload="handleBeforeUpload"
              accept=".pdf"
              multiple
              :limit="5"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
            >
              <el-button
                slot="trigger"
                plain
                size="mini"
                icon="el-icon-upload2"
                type="primary"
              >Click to upload</el-button>
              <div slot="tip" class="el-upload__tip">pdf files with a size less than 5 Mb</div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <el-row>
        <el-button
          v-for="item in filterDecision(decisions)"
          :key="item"
          plain
          size="mini"
          :loading="saveLoading"
          type="success"
          style="float: right; margin-left: 1rem"
          @click.prevent="submitAction(item)"
        >
          {{ item.replace('_', '-') }}
        </el-button>

        <el-button
          plain
          size="mini"
          style="float: right"
          type="warning"
          @click.prevent="closeDialog"
        >
          Cancel
        </el-button>
      </el-row>
    </el-dialog>
    <el-dialog width="85vw" center :title="formTitle" :visible.sync="showFormDialog" :before-close="showSaveAsDraftDialog" @closeDialog="closeFormDialog">
      <dynamicForm :form-details="selectedForm" :send-save-signal="sendSaveSignal" :task-name="formTitle" :visible="showFormDialog" @updateFormAsDraft="updateFormAsDraft" />
    </el-dialog>
  </div>
</template>

<script>
import { getLicenceAndTasksById } from '@/api/licences'
import { getAllAttachmentsTypeList } from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import dynamicForm from '@/views/tasks/forms/dynamicForm'
import { saveActivity, saveActivityAttachment } from '@/api/tasks'

export default {
  name: 'TaskAssignmentComponent',
  components: {
    dynamicForm
  },
  props: {
    licenceType: {
      type: String,
      default: () => ''
    },
    licenceId: {
      type: Number,
      default: () => 0
    },
    taskId: {
      type: Number,
      default: () => 0
    },
    associatedTasksLoading: {
      type: Boolean,
      default: () => false
    },
    licenceTaskInformation: {
      type: Array,
      default: () => []
    },
    licenceForms: {
      type: Object,
      default: () => {}
    },
    availableActors: {
      type: Array,
      default: () => []
    },
    decisions: {
      type: Array,
      default: () => []

    },
    licenceDetails: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // licenceDetails: {},
      datePickerOptions: {
        disabledDate(date) {
          return date <= new Date()
        }
      },
      listLoading: false,
      assignmentDialog: false,
      commentDialog: false,
      selectedForm: {},
      showFormDialog: false,
      sendSaveSignal: false,
      title: '',
      formTitle: '',
      saveLoading: false,
      actionModel: {
        actors: [],
        licenseId: '',
        comments: '',
        attachments: [],
        hasAttachment: false,
        hasPresentation: false,
        findings: [],
        dueDate: ''
      },
      attachmentObject: {
        name: '',
        attachmentType: ''
      },
      actorsRequired: {
        actors: [{ required: true, message: 'Please Select actors. ', trigger: 'change' }],
        comments: [{ required: true, message: 'Comments are required', trigger: 'blur' }]
      },
      fileList: [],
      attachmentTypes: [],
      secondaryFileList: []
    }
  },
  computed: {
    licenceActivityList() {
      return this.licenceDetails?.licence?.activities.length > 0
    },
    availableForms() {
      const temp = [this.licenceForms]
      return temp
    }
  },
  watch: {
    availableForms: {
      handler: function(newVal, oldVal) {
        if (newVal.length > 0) {
          this.populateFindings()
        }
      }
    }
  },
  created() {
    this.fetchAttachmentTypes()
    this.populateFindings()
  },
  methods: {
    filterDecision(d) {
      return d.filter(e => e !== 'SAVE')
    },
    fetchData() {
      this.listLoading = true
      getLicenceAndTasksById(this.licenceId).then(response => {
        if (response.data) {
          this.licenceDetails = response.data
          this.licenceTaskInformation = this.licenceDetails?.licence?.track
          this.licenceForms = this.licenceDetails?.forms
          this.availableActors = this.licenceDetails?.actors
          this.decisions = this.licenceDetails?.decisions
          this.listLoading = false
        } else {
          this.$message({
            message: response.message,
            type: 'warning',
            duration: 5000,
            showClose: true
          })
          this.listLoading = true
        }
      }).catch(e => {
      })
    },
    fetchAttachmentTypes() {
      getAllAttachmentsTypeList(0, 200).then(response => {
        this.attachmentTypes = response.data.content
      })
    },
    showForm(data) {
      this.formTitle = data.name
      this.selectedForm = data
      this.sendSaveSignal = false
      this.showFormDialog = true
    },
    closeFormDialog(status) {
      if (status) {
        this.showFormDialog = false
      }
    },
    populateFindings() {
      if (this.availableForms?.length > 0) {
        this.sendToBag(this.availableForms[0]?.items)
        this.actionModel.findings = this.resultsETL(this.actionModel?.findings)
      }
    },
    sendDecisionResults(decisionChosen) {
      // close the dialog
      return new Promise(resolve => {
        this.assignmentDialog = !this.assignmentDialog
        const customPresentationDate = this.actionModel.presentationDate ? this.actionModel?.presentationDate.toISOString().replace('T', ' ').split('.')[0] : ''
        const data = {
          comment: this.actionModel.comments,
          decision: decisionChosen,
          actors: this.actionModel.actors,
          id: this.taskId,
          findings: this.actionModel.findings,
          presentationDate: customPresentationDate,
          dueDate: this.actionModel.dueDate
        }
        let backendResponse = {}
        this.saveLoading = true
        //  send data to backend , and receive the action id
        saveActivity(data).then(response => {
          this.saveLoading = false

          if (response.code === statusCodes.SUCCESS) {
            backendResponse = response.data

            this.$message({
              message: 'Actions/Decisions saved successfully',
              type: 'success',
              showClose: true,
              duration: 3000
            })
          } else {
            backendResponse = false
          }

          resolve(backendResponse)
        }).catch(_ => {
          this.$emit('requestPageRefresh', true)
          this.saveLoading = false
        })
      })
    },
    resultsETL(data) {
      return data.filter(item => item.finding && item.finding !== '')
    },
    removeAndAddToBag(userFindingData) {
      this.actionModel.findings.push(userFindingData)
      return true
    },
    sendToBag(sentData) {
      sentData?.forEach(item => {
        if (item.flag !== 'PARAMETER') {
          item.items?.forEach(subItem => {
            if (subItem.flag === 'PARAMETER') {
              this.removeAndAddToBag(subItem)
            } else {
              this.sendToBag(subItem.items)
            }
          })
        }
      })
    },
    async submitAction(decisionChosen) {
      this.$refs.assignmentDialog.validate((valid) => {
        if (valid) {
          this.submissionAction(decisionChosen)
        }
      })
    },
    async submissionAction(decisionChosen) {
      this.assignmentDialog = false
      let payload
      try {
        const hasAttachment = this.actionModel.hasAttachment
        const a = await this.sendDecisionResults(decisionChosen)
        if (a) {
          if (a !== false) {
            this.saveLoading = false
            if (hasAttachment) {
              for (let i = 0; i < this.secondaryFileList.length; i++) {
                const attachmentForm = new FormData()
                await attachmentForm.append('attachmentType', this.attachmentObject.attachmentType)
                await attachmentForm.append('uri', this.secondaryFileList[i].raw)
                await attachmentForm.append('activityId', a.id)
                saveActivityAttachment(attachmentForm).then(response => {
                  if (response.code === statusCodes.SUCCESS) {
                    this.$message({
                      message: 'Attachment saved successfully',
                      type: 'success',
                      showClose: true,
                      duration: 3000
                    })
                  }
                })
              }
            } else {
              this.$emit('requestPageRefresh', true)
            }
          }
        }
      } catch (e) {
        this.$emit('requestPageRefresh', true)
      }
      this.$emit('requestPageRefresh', true)
      return payload
    },
    handleProgress(ev, file, fileLIst) {
      file.raw['status'] = 'uploading'
    },
    handleSuccess(res, file, fileLIst) {
      file.raw['status'] = 'success'
    },
    handleUploadChange(file, fileList) {
      this.secondaryFileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(`Maximum uploads (5) reached.`)
    },
    handleBeforeUpload(file) {
      const allowedCsvMime = [
        'application/pdf',
        'application/acrobat',
        'application/x-pdf',
        'applications/vnd.pdf',
        'text/pdf',
        'text/x-pdf'
      ]
      if (allowedCsvMime.includes(file.type)) {
        return true
      } else {
        this.$message.error(
          'You can only upload pdf files. No other file types are allowed'
        )
        // this.fileList.pop(file)
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('PDF size can not exceed 2MB!')
      }
    },
    filterName(item) {
      const lastName = item.lastName ?? ''
      const middleName = item.middleName ?? ''
      const firstName = item.firstName ?? ''
      return firstName + ' ' + middleName + ' ' + lastName
    },
    contains(array, otherArray) {
      return array.every(item => otherArray.indexOf(item) !== -1)
    },
    filterActions() {
      // Check for assign
      // if (this.contains(this.decisions, ['ASSIGN'])) {
      this.showAssignment()
      // } else {
      //   //  check for comment box (approve, reject, Resubmit, revise, complete, recommend)
      // }
    },
    showAssignment() {
      this.title = this.licenceDetails.taskName
      this.assignmentDialog = true
    },
    showComments() {
      this.title = this.licenceTaskInformation[0].stepName
      this.commentDialog = true
    },
    closeDialog() {
      this.$refs?.assignmentDialog?.resetFields()
      this.assignmentDialog = !this.assignmentDialog
      this.actionModel.actors = []
    },
    showSaveAsDraftDialog(done) {
      this.$confirm('You have unsaved changes, save and proceed?', 'Confirm', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Discard Changes'
      })
        .then(() => {
          this.sendSaveSignal = true
          done()
          this.$message({
            type: 'info',
            message: 'Changes saved.'
          })
        })
        .catch(action => {
          done()
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? 'Changes discarded.'
              : 'Stay in the current route'
          })
        })
    },
    updateFormAsDraft(formDetails) {
      const data = {
        comment: 'Form saved as draft',
        decision: 'SAVE',
        actors: [],
        id: this.taskId,
        findings: formDetails
      }
      //  send data to backend , and receive the action id
      saveActivity(data).then(response => {
        if (response.code === statusCodes.SUCCESS) {
          this.$message({
            message: 'Form draft saved successfully',
            type: 'success',
            showClose: true,
            duration: 3000
          })
        }
        // this.$emit('requestPageRefresh', true)
      })
    }
  }
}
</script>

<style scoped>

</style>
