<template>
  <div v-loading="listLoading" class="app-container">
    <el-steps :active="activeStep" align-center finish-status="success">
      <el-step title="Details" />
      <el-step title="Steps" />
    </el-steps>
    <div v-if="activeStep === 0">
      <el-form
        ref="wfRef"
        :model="wfData"
        :rules="wfRules"
        label-width="200px"
        label-position="left"
      >

        <el-form-item label="Workflows Name" prop="name" required>
          <el-input v-model="wfData.name" />
        </el-form-item>
        <el-form-item label="Workflows Code" prop="code" required>
          <el-input v-model="wfData.code" />
        </el-form-item>
        <el-form-item label="Workflows Type" prop="workflowType" required>
          <el-select v-model="wfData.workflowType" style="width: 64vw" placeholder="Workflow Action" filterable>
            <el-option v-for="i in lists.wfTypes" :key="i.id" :label="i.name" :value="i.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Workflows Description" prop="description" required>
          <el-input v-model="wfData.description" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button plain size="mini" @click="resetForm('wfRef')">Reset</el-button>
          <el-button plain size="mini" type="primary" style="margin-top: 12px;" @click="next">Next step</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div v-if="activeStep === 1">
      <div style="padding-bottom: 1em;">
        <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="createStepHandle">Add Step</el-button>
      </div>
      <el-table
        fit
        highlight-current-row
        size="mini"
        :data="wfData.steps"
      >
        <el-table-column label="#" width="80" align="left">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Step Type" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.stepType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Notify Applicant" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.applicantNotify ? 'Yes' : 'No' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Decisions" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.decisions.length }}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Code <b>{{ props.row.code }}</b></p>
            <p>Form <b>{{ props.row.form ? props.row.form.name : mapValueTypeById(props.row.formId, 'forms') }}</b></p>
            <template v-if="props.row.stepType === 'NORMAL'">
              <p>Step Due Days: <b>{{ props.row.dueDays }}</b></p>
              <p>Current Role: <b>{{ props.row.currentRole ? props.row.currentRole.name : mapValueTypeById(props.row.currentRoleId, 'roles') }}</b></p>
            </template>
            <template v-else-if="props.row.stepType === 'PAYMENT'">
              <ul class="ti-list-ol">
                <li>Applicable State: <b>{{ props.row.applicableState }}</b></li>
              </ul>
            </template>
            <template v-else-if="props.row.stepType === 'DOCUMENT_GENERATION'">
              <ul class="ti-list-ol">
                <li>Document Generated: <b>{{ props.row.attachmentType ? props.row.attachmentType.name : mapValueTypeById(props.row.attachmentType, 'attachmentTypes') }}</b></li>
              </ul>
            </template>
            <ul class="ti-list-ol">
              <li v-for="(decision, k) in props.row.decisions" :key="k">Decision: <b>{{ decision.decision }}</b>&middot;
                Template: <b>{{ decision.notificationTemplate ? decision.notificationTemplate.displayName : mapValueTypeById(decision.notificationTemplateId, 'notifications') }}</b>&middot;
                External Status: <b>{{ decision.licenceStatus ? decision.licenceStatus.name : mapValueTypeById(decision.statusId, 'licenceStatuses') }}</b></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="Action" align="center">
          <template slot-scope="scope">
            <!-- <el-tooltip content="Up" placement="top">
              <el-button
                plain
                size="mini"
                type="info"
                icon="el-icon-arrow-up"
                @click.prevent="handleStepUp(scope.$index)"
              />
            </el-tooltip>
            <el-tooltip content="Down" placement="top">
              <el-button
                plain
                size="mini"
                type="info"
                icon="el-icon-arrow-down"
                @click.prevent="handleStepDown(scope.$index)"
              />
            </el-tooltip> -->
            <el-tooltip content="Edit" placement="top">
              <el-button
                plain
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click.prevent="editStep(scope.row, scope.$index)"
              />
            </el-tooltip>
            <el-tooltip content="Delete" placement="top">
              <el-button
                plain
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click.prevent="deleteStep(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item>
          <el-button plain size="mini" @click="previous()">Previous</el-button>
          <el-button plain size="mini" type="primary" style="margin-top: 12px;" @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>

    </div>
    <el-dialog :visible.sync="show.stepForm" :title="title" width="75%">
      <div>
        <el-form
          ref="wfStepRef"
          :model="wfSteps"
          :rules="wfStepsRules"
          label-width="160px"
          label-position="left"
          size="small"
        >
          <el-form-item label="Step Name" prop="name" required>
            <el-input v-model="wfSteps.name" />
          </el-form-item>
          <el-form-item label="Step Code" prop="code" required>
            <el-input v-model="wfSteps.code" />
          </el-form-item>
          <el-form-item label="Notify Applicant" prop="applicantNotify" required>
            <el-radio-group v-model="wfSteps.applicantNotify">
              <el-radio :label="true">Yes</el-radio>
              <el-radio :label="false">No</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Step Type" prop="stepType">
            <el-radio-group v-model="wfSteps.stepType" required>
              <el-radio
                v-for="(stepType, k) in stepTypes"
                :key="k"
                class="pb-2"
                :checked="stepType === wfSteps.stepType"
                :label="stepType"
              >{{ stepType }}
              </el-radio>
            </el-radio-group>

          </el-form-item>
          <div v-if="isNormal">
            <el-form-item label="Due Days" prop="dueDays">
              <el-input-number v-model="wfSteps.dueDays" size="small" :step="1" />
            </el-form-item>
            <el-form-item
              label="Forms"
              prop="formId"
            >
              <el-select
                v-model="wfSteps.formId"
                value-key="workflowStepFormId"
                filterable
                :loading="loading.form"
                placeholder="Select Form"
                style="min-width: 60vw"
              >
                <el-option
                  v-for="item in lists.forms"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Required Attachment" prop="attachmentType">
              <el-select
                v-model="wfSteps.attachmentType"
                value-key="workflowStepAttachmentTypeId"
                filterable
                clearable
                :loading="loading.attachmentType"
                placeholder="Select Attachment"
                style="min-width: 60vw"
              >
                <el-option
                  v-for="item in lists.attachmentTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="Action Role"
              prop="currentRoleID"
              :required="isNormal"
            >
              <el-select
                v-model="wfSteps.currentRoleID"
                value-key="workflowStepCurrentRoleId"
                filterable
                :loading="loading.currentRole"
                placeholder="Select Roles"
                style="min-width: 60vw"
              >
                <el-option
                  v-for="item in lists.roles"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Possible Decisions" prop="decision">
              <el-checkbox-group v-model="selectedDecision" required @change="viewChange">
                <el-checkbox
                  v-for="(decision, k) in decisions"
                  :key="k"
                  :label="decision"
                  @change="elementCheckChange(decision)"
                />
              </el-checkbox-group>

            </el-form-item>
            <el-form-item>
              <el-row v-for="(selected, k) in finalDecisions" :key="k" class="pb-2">
                <el-col :span="8">
                  <b>
                    {{ selected.decision.toLocaleString() }}
                  </b>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="selected.notificationTemplateId"
                    :value-key="'workflowStepTemplateId_'+k"
                    clearable
                    filterable
                    :loading="loading.notification"
                    placeholder="Notification Template"
                  >
                    <el-option
                      v-for="item in lists.notifications"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>

                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="selected.statusId"
                    :value-key="'workflowStepStatusId_'+k"
                    clearable
                    filterable
                    :loading="loading.licenceStatuses"
                    placeholder="Overview Status"
                  >
                    <el-option
                      v-for="item in lists.licenceStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>

                </el-col>
              </el-row>
            </el-form-item>
          </div>

          <div v-else-if="isPayment">
            <el-form-item label="Applicable State" prop="applicableState" :required="isPayment">
              <el-radio-group v-model="wfSteps.applicableState" size="small">
                <el-radio
                  v-for="(state, k) in lists.applicableState"
                  :key="k"
                  :checked="wfSteps.applicableState === state"
                  :label="state"
                >{{ state }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Possible Decisions" prop="decision">
              <el-checkbox-group v-model="selectedDecision" required>
                <el-checkbox
                  v-for="(decision, k) in paymentDecisions"
                  :key="k"
                  :label="decision"
                  @change="elementCheckChange(decision)"
                />
              </el-checkbox-group>

            </el-form-item>
            <el-form-item>
              <el-row v-for="(selected, k) in finalDecisions" :key="k" class="pb-2">
                <el-col :span="8">
                  <b>
                    {{ selected.decision.toLocaleString() }}
                  </b>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="selected.notificationTemplateId"
                    :value-key="'workflowStepTemplateId__'+k"
                    clearable
                    filterable
                    :loading="loading.notification"
                    placeholder="Notification Template"
                  >
                    <el-option
                      v-for="item in lists.notifications"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>

                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="selected.statusId"
                    :value-key="'workflowStepStatusId__'+k"
                    clearable
                    filterable
                    :loading="loading.licenceStatuses"
                    placeholder="Overview Status"
                  >
                    <el-option
                      v-for="item in lists.licenceStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>

                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <div v-else-if="isDocumentGeneration">
            <el-form-item label="Document" prop="attachmentType" :required="isDocumentGeneration">
              <el-select
                v-model="wfSteps.attachmentType"
                value-key="workflowStepAttachmentTypeId"
                filterable
                clearable
                :loading="loading.attachmentType"
                placeholder="Select Document"
                style="min-width: 60vw"
              >
                <el-option
                  v-for="item in lists.attachmentTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Possible Decisions" prop="decision">
              <el-checkbox-group v-model="selectedDecision" required>
                <el-checkbox
                  v-for="(decision, k) in generateDecisions"
                  :key="k"
                  :label="decision"
                  @change="elementCheckChange(decision)"
                />
              </el-checkbox-group>

            </el-form-item>
            <el-form-item>
              <el-row v-for="(selected, k) in finalDecisions" :key="k" class="pb-2">
                <el-col :span="8">
                  <b>
                    {{ selected.decision.toLocaleString() }}
                  </b>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="selected.notificationTemplateId"
                    clearable
                    filterable
                    :loading="loading.notification"
                    placeholder="Notification Template"
                  >
                    <el-option
                      v-for="item in lists.notifications"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>

                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="selected.statusId"
                    clearable
                    filterable
                    :loading="loading.licenceStatuses"
                    placeholder="Overview Status"
                  >
                    <el-option
                      v-for="item in lists.licenceStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button
              v-if="show.edit"
              plain
              icon="el-icon-edit"
              size="mini"
              type="warning"
              @click.prevent="editWorkflowStep"
            >
              Edit Step
            </el-button>
            <el-button
              v-else-if="show.create"
              plain
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click.prevent="addWorkflowStep"
            >
              Add Step
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createWorkflow,
  getListOfNotification,
  getAllAttachmentsTypeList,
  getListOfActiveWorkflowType, getListOfLicenceForms,
  getListOfLicenceStatus,
  getWorkflowsBy
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { getAllRolesList } from '@/api/user'
import { array_move, decodeHashId } from '@/utils'

export default {
  name: 'CreateWorkflow',
  data() {
    return {
      title: 'Create Workflow',
      listLoading: false,
      activeStep: 0,
      input3: '',
      tricks2: [],
      select: '',
      selectedDecision: [],
      selectedStepType: [],
      decisions: [
        'APPROVE',
        'RECOMMEND',
        'RESUBMIT',
        'REJECT',
        'REVISE',
        'ASSIGN',
        'COMPLETE',
        'SAVE',
        'NO_OBJECTION',
        'OBJECTION',
        'INVITE',
        'ACKNOWLEDGE',
        'CONSULT_MINISTRY',
        'AGREED'
      ],
      paymentDecisions: ['PAYMENT'],
      generateDecisions: ['GENERATE'],
      stepTypes: ['NORMAL', 'PAYMENT', 'DOCUMENT_GENERATION'],
      oldWfSteps: {
        code: null,
        name: null,
        currentRoleID: null,
        applicantNotify: true,
        notifyRoles: [],
        decisions: []
      },
      wfSteps: {
        index: 0,
        code: null,
        name: null,
        formId: null,
        dueDays: 0,
        applicantNotify: false,
        stepType: 'NORMAL',
        currentRoleID: null,
        decisions: [],
        applicableState: 'UNCHARGABLE',
        attachmentType: null
      },
      wfStepsRules: {
        applicableState: [{ required: true, message: 'Please select the fee applicable state', trigger: 'blur' }],
        code: [{ required: true, message: 'Please select the code', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }],
        name: [{ required: true, message: 'Please select the fee name', trigger: 'change' },
          { min: 3, message: 'Length should be at least 3', trigger: 'change' }]
      },
      wfData: {
        name: '',
        code: '',
        workflowType: null,
        description: null,
        steps: []
      },
      wfRules: {
        name: [
          {
            required: true,
            message: 'Workflow Name Is Required',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        stepType: [{ required: true, message: 'Select Step Type', trigger: 'blur' }],
        code: [
          {
            required: true,
            message: 'Workflow Code Is Required',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      },
      form: {
        valid: false
      },
      show: {
        stepForm: false,
        edit: false,
        create: true
      },
      loading: {
        licenceStatuses: false,
        notifications: false,
        form: false,
        list: false,
        notifyRoles: false,
        currentRole: false,
        applicableState: false,
        attachmentType: false,
        workflowType: false,
        wfData: false,
        save: false
      },
      lists: {
        notifications: [],
        roles: [],
        forms: [],
        attachmentTypes: [],
        licenceStatuses: [],
        applicableState: [
          'ENTITY_REGISTRATION',
          'APPLICATION',
          'INITIAL_PAYMENT',
          'LICENSE_EXPIRED',
          'ACCOUNT_INITIATION',
          'LICENSERENEWAL',
          'CONSTRUCTIONPERMIT',
          'UNCHARGABLE'
        ],
        wfTypes: []
      },
      temporarySelectedDecisions: [],
      finalDecisions: []
    }
  },
  computed: {
    isNormal() {
      return this.wfSteps.stepType === 'NORMAL'
    },
    isPayment() {
      return this.wfSteps.stepType === 'PAYMENT'
    },
    isDocumentGeneration() {
      return this.wfSteps.stepType === 'DOCUMENT_GENERATION'
    }
  },
  created() {
    // TODO -- change the endpoint associated with the fetch data to change
    // this.subCategoryType = this.$route.params.subCategoryType
    // this.parentId = this.$route.params.parentId
    this.resourceAction = this.$route.params.resourceAction

    // check if this is duplication
    this.isDuplication = this.$route.query.duplicateId ?? false

    if (this.isDuplication) {
    // if yes then follow
      this.getDuplicatedWorkflowData(decodeHashId(this.isDuplication))
    }

    this.fetchData()
  },
  methods: {
    nullableCheck(object, attribute) {
      if (object === null || object === undefined) return `No ${attribute}`
      return object[attribute]
    },
    handleStepUp(current_position) {
      const steps = this.wfData.steps
      this.wfData.steps = array_move(steps, current_position, current_position - 1)
    },
    handleStepDown(current_position) {
      const steps = this.wfData.steps
      this.wfData.steps = array_move(steps, current_position, current_position + 1)
    },
    getDuplicatedWorkflowData(Id) {
      this.listLoading = true
      getWorkflowsBy(Id).then(res => {
        const data = res.data
        // remove ids ...
        data.workflowType = data.workflowType?.id

        delete data.links
        delete data.createdAt
        delete data.updatedAt
        delete data.active
        delete data.id

        // cleaning data to match the BACKEND DTO
        const steps = data.steps.flatMap(step => {
          const tmp = step

          tmp.id = 0
          tmp.formId = tmp.form?.id ?? 0
          tmp.currentRoleID = tmp.currentRole?.id ?? 0
          tmp.attachmentType = tmp.attachmentType?.id ?? 0
          tmp.applicableState = (tmp.applicableState === null || tmp.applicableState === undefined)
            ? 'UNCHARGABLE' : tmp.applicableState

          tmp.decisions = tmp.decisions.flatMap(decision => {
            const d = decision
            d.id = 0

            d.decision = decision.decision
            d.statusId = decision.licenceStatus?.id ?? 1
            d.notificationTemplateId = decision.notificationTemplate?.id ?? 0

            delete d.createdAt
            delete d.licenceStatus
            delete d.notificationTemplate
            delete d.active

            return d
          })

          delete tmp.nextRole
          delete tmp.currentRole
          delete tmp.previousRole
          delete tmp.createdAt
          delete tmp.updatedAt
          delete tmp.form
          delete tmp.active
          delete tmp.notifyRoles
          delete tmp.stepNumber
          delete tmp.workflow

          // delete tmp.attachmentType
          return tmp
        })

        data.steps = steps

        // show the form
        this.show.create = false
        this.show.edit = true

        this.wfData = data
        this.listLoading = false
      })
    },
    elementCheckChange(data) {
      if (this.temporarySelectedDecisions.includes(data)) {
        //  remove it from the tracker..
        // console.log('REMOVAL OPPS')
        const index = this.temporarySelectedDecisions.indexOf(data)
        if (index !== -1) {
          this.temporarySelectedDecisions.splice(index, 1)
        }
        this.finalDecisions = this.finalDecisions.filter(x => {
          return x.decision !== data
        })
      } else {
        // add it to the tracker
        this.temporarySelectedDecisions.push(data)
        const newDecision = {
          decision: data,
          notificationTemplateId: null,
          statusId: null
        }
        this.finalDecisions.push(newDecision)
      }
    },
    viewChange(data) {
      // console.log(this.bagOfTricks)
      // console.log('finally -- **** ---')
      // // const arr = this.bagOfTricks.filter(i => data.includes(i.decision))
      // console.log(arr)
    },
    createStepHandle() {
      this.show.stepForm = true
      this.show.create = true
      this.show.edit = false
      this.title = 'Add Step'
    },
    fetchData() {
      this.listLoading = true

      getListOfActiveWorkflowType().then(response => {
        this.lists.wfTypes = response.data
      })

      getListOfNotification(0, 100).then(res => {
        this.lists.notifications = res.data.content
      })

      getListOfLicenceForms().then(res => {
        this.lists.forms = res.data.content
      })

      getListOfLicenceStatus(0, 100).then(res => {
        this.lists.licenceStatuses = res.data.content
      })

      getAllRolesList().then(response => {
        this.lists.roles = response.data.content
      })

      getAllAttachmentsTypeList(0, 100, '', 'id,ASC').then(response => {
        this.lists.attachmentTypes = response.data.content
        this.listLoading = false
      })
    },
    addWorkflowStep() {
      this.$refs['wfStepRef'].validate((valid) => {
        if (valid) {
          const wfStep = this.wfSteps
          wfStep.id = 0

          wfStep.formId = (wfStep.formId === null || wfStep.formId === undefined)
            ? 0 : wfStep.formId
          wfStep.decisions = this.finalDecisions

          // cleaning.
          if (this.isNormal) {
            wfStep.applicableState = 'UNCHARGABLE'
            wfStep.attachmentType = 0
          } else if (this.isPayment) {
            wfStep.currentRoleID = 0
            wfStep.attachmentType = 0
          } else if (this.isDocumentGeneration) {
            wfStep.currentRoleID = 0
            wfStep.applicableState = 'UNCHARGABLE'
          }

          this.wfData.steps.push(wfStep)
          this.clearDialog()
        }
      })
    },
    submitForm(formName) {
      // clean by replacing null with 0
      this.listLoading = true
      createWorkflow(this.wfData)
        .then(response => {
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Workflow Created Successfully.',
              showClose: true,
              type: 'success'
            })
            this.listLoading = false
            this.$router.push({ name: 'Workflow.Index' })
          }
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    editWorkflowStep() {
      this.$refs['wfStepRef'].validate((valid) => {
        if (valid) {
          const wfStep = this.wfSteps

          wfStep.formId = (wfStep.formId === null || wfStep.formId === undefined)
            ? 0 : wfStep.formId
          wfStep.decisions = this.finalDecisions

          // cleaning.
          if (this.isNormal) {
            wfStep.applicableState = 'UNCHARGABLE'
            wfStep.attachmentType = 0
          } else if (this.isPayment) {
            wfStep.currentRoleID = 0
            wfStep.attachmentType = 0
          } else if (this.isDocumentGeneration) {
            wfStep.currentRoleID = 0
            wfStep.applicableState = 'UNCHARGABLE'
          }

          // this replaces the new changes to the old index.
          // const index = this.wfData.steps.indexOf(wfStep)
          // this.wfData.steps[index] = wfStep
          this.$set(this.wfData.steps, wfStep.index, wfStep)

          this.clearDialog()
        }
      })
    },
    editStep(data, index) {
      // set data in the form
      // this.wfSteps = data
      // this.wfSteps.formId = data.form?.id ?? 0
      // this.wfSteps.attachmentTypeId = data.attachmentType?.id ?? 0
      // this.wfSteps.currentRoleID = data.currentRole?.id ?? 0

      // // set the decisions.
      // // ['ACTIONS']
      // // [{objects}]
      // this.selectedDecision = data.decisions.flatMap((d) => {
      //   return d.decision
      // })
      // this.finalDecisions = data.decisions.flatMap((d) => {
      //   return {
      //     decision: d.decision,
      //     notificationTemplateId: d.notificationTemplateId ?? 0,
      //     statusId: d.statusId ?? (d.licenceStatus?.id ?? 0) // check of status Id is available else check licenceStatus
      //   }
      // })

      let steps = data

      steps.index = index
      steps.formId = data.formId ?? (data.form?.id ?? 0)
      steps.attachmentType = data.attachmentType ?? (data.attachmentType?.id ?? 0)
      steps.currentRoleID = data.currentRoleID ?? (data.currentRole?.id ?? 0)

      steps = this.clearObjectSteps(steps)

      this.wfSteps = Object.assign({}, this.wfSteps, steps)

      // this.wfSteps.formId = data.form?.id ?? 0
      // this.wfSteps.attachmentTypeId = data.attachmentType?.id ?? 0
      // this.wfSteps.currentRoleID = data.currentRole?.id ?? 0

      // set the decisions.
      // ['ACTIONS']
      // [{objects}]
      const selected = data.decisions.flatMap((d) => {
        return d.decision
      })

      // select the changed decisions
      selected.forEach((value, index) => this.$set(this.selectedDecision, index, value))

      // trigger change in checkbox
      data.decisions.forEach((d) => { this.elementCheckChange(d.decision) })

      // setup the decisions status and notifications
      this.finalDecisions = data.decisions.flatMap((d) => {
        return {
          decision: d.decision,
          notificationTemplateId: d.notificationTemplateId ?? (d.notificationTemplate?.id ?? null),
          statusId: d.statusId ?? (d.licenceStatus?.id ?? 0)
        }
      })

      // finals.forEach((value, index) => this.$set(this.finalDecisions, index, value))

      // show the form
      this.show.stepForm = true
      this.show.create = false
      this.show.edit = true

      // send to the same payload
    },
    deleteStep(data) {
      const index = this.wfData.steps.indexOf(data)
      if (index > -1) {
        this.wfData.steps.splice(index, 1)
      }
    },
    next() {
      this.$refs['wfRef'].validate((valid) => {
        if (valid) {
          if (this.activeStep++ > 2) this.activeStep = 0
        }
      })
    },
    previous() {
      if (this.activeStep-- < 2) this.activeStep = 0
    },
    mapValueTypeById(typeId, valueType) {
      if (valueType === 'roles') {
        return this.lists.roles.filter(e => e.id === typeId)[0]?.name
      } else if (valueType === 'notifications') {
        return this.lists.notifications.filter(e => e.id === typeId)[0]?.displayName
      } else if (valueType === 'licenceStatuses') {
        return this.lists.licenceStatuses.filter(e => e.id === typeId)[0]?.name
      } else if (valueType === 'attachmentTypes') {
        return this.lists.attachmentTypes.filter(e => e.id === typeId)[0]?.name
      } else if (valueType === 'forms') {
        return this.lists.forms.filter(e => e.id === typeId)[0]?.name
      } else {
        return typeId
      }
    },
    clearObjectSteps(step) {
      delete step.nextRole
      delete step.currentRole
      delete step.previousRole
      delete step.createdAt
      delete step.updatedAt
      delete step.form
      delete step.active
      delete step.notifyRoles
      delete step.stepNumber
      delete step.workflow
      return step
    },
    clearDialog() {
      this.title = null
      this.show.stepForm = false
      this.wfSteps = Object.assign({}, this.wfSteps, {
        index: 0,
        code: null,
        name: null,
        applicantNotify: false,
        stepType: 'NORMAL',
        currentRoleID: null,
        decisions: [],
        applicableState: 'UNCHARGABLE',
        attachmentType: null
      })
      this.temporarySelectedDecisions = []
      this.finalDecisions = []
      this.selectedDecision = []
      // this.$refs['wfStepRef'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
