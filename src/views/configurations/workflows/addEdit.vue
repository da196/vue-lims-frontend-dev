<template>
  <div class="app-container">
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
          <el-button size="mini" @click="resetForm('wfRef')">Reset</el-button>
          <el-button size="mini" style="margin-top: 12px;" @click="next">Next step</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div v-if="activeStep === 1">
      <div style="padding-bottom: 1em;">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="createStepHandle">Add Step</el-button>
      </div>
      <el-table fit highlight-current-row border size="small" :data="wfData.steps">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Code <b>{{ props.row.code }}</b></p>
            <p>Notified Roles <b>{{ props.row.notifyRoles.map((e) => mapValueTypeById(e, 'roles')).join(', ') }}</b></p>
            <p>Notify Applicant <b>{{ props.row.applicantNotify }}</b></p>
            <ul class="ti-list-ol">
              <li v-for="(decision, k) in props.row.decision" :key="k">Decision: <b>{{ decision.decision }}</b>&middot;
                Template: <b>{{ mapValueTypeById(decision.notificationTemplateId, 'notifications') }}</b>&middot;
                External Status: <b>{{ mapValueTypeById(decision.statusId, 'lovs') }}</b></li>
            </ul>
          </template>
        </el-table-column>

        <el-table-column label="Name" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action Role" sortable align="center">
          <template slot-scope="scope">
            <span>{{ mapValueTypeById(scope.row.currentRoleID, 'roles') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click.prevent="deleteItem(scope.row)"> Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form>
        <el-form-item>
          <el-button size="mini" plain @click="previous()">Previous</el-button>
          <el-button size="mini" type="primary" plain style="margin-top: 12px;" @click="submitForm">Submit</el-button>
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
          <el-form-item label="Action Role" prop="currentRoleID" required>
            <el-select
              v-model="wfSteps.currentRoleID"
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
          <el-form-item label="Internal Notification" prop="notifyRoles" required>
            <el-select
              v-model="wfSteps.notifyRoles"
              clearable
              multiple
              filterable
              :loading="loading.notifyRoles"
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
          <el-form-item label="Notify Applicant" prop="applicantNotify" required>
            <el-checkbox
              v-model="wfSteps.applicantNotify"
              true-label="true"
              false-label="false"
              label="Notify the Applicant"
            />
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
                  clearable
                  filterable
                  :loading="loading.notification"
                  placeholder="Notification Template"
                >
                  <el-option
                    v-for="item in lists.notifications"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="selected.statusId"
                  clearable
                  filterable
                  :loading="loading.lovs"
                  placeholder="Overview Status"
                >
                  <el-option
                    v-for="item in lists.lovs"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-plus" size="mini" type="primary" @click.prevent="addWorkflowStep">
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
  getAllListOfValueList,
  getActiveListOfNotification,
  getListOfActiveWorkflowType
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
import { getAllRolesList } from '@/api/user'

export default {
  name: 'AddEditWorkflow',
  data() {
    return {
      title: 'Create Workflow',
      activeStep: 0,
      input3: '',
      tricks2: [],
      bagOfTricks: [
        {
          decision: '',
          notificationTemplateId: null,
          statusId: null
        }
      ],
      mapper: {
        decision: '',
        notificationTemplateId: null,
        statusId: null
      },
      select: '',
      selectedDecision: [],
      decisions: ['APPROVE', 'RECOMMEND', 'RESUBMIT', 'REJECT', 'REVISE', 'CANCEL', 'COMPLETE', 'PAYMENT'],
      wfSteps: {
        code: null,
        name: null,
        currentRoleID: null,
        applicantNotify: true,
        notifyRoles: [],
        decision: []
      },
      wfStepsRules: {
        applicableState: [{ required: true, message: 'Please select the fee applicable state', trigger: 'blur' }],
        code: [{ required: true, message: 'Please select the GFS code', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }],
        feeAmount: [{ required: true, message: 'Please enter the fee amount', trigger: 'blur' }],
        feeCurrency: [{ required: true, message: 'Please select the fee currency', trigger: 'blur' }],
        feePercent: [{ required: true, message: 'Please enter the fee percent', trigger: 'blur' }],
        feeType: [{ required: true, message: 'Please select the fee type', trigger: 'blur' }],
        frequency: [{ required: true, message: 'Please enter the fee frequency', trigger: 'blur' }],
        name: [{ required: true, message: 'Please select the fee name', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }],
        period: [{ required: true, message: 'Please enter the fee period', trigger: 'blur' }]
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
        stepForm: false
      },
      loading: {
        lovs: false,
        notifications: false,
        list: false,
        notifyRoles: false,
        currentRole: false,
        workflowType: false,
        wfData: false,
        save: false
      },
      lists: {
        lovs: [],
        notifications: [],
        roles: [],
        wfTypes: []
      },
      temporarySelectedDecisions: [],
      finalDecisions: []
    }
  },
  created() {
    // TODO -- change the endpoint associated with the fetch data to change
    // this.subCategoryType = this.$route.params.subCategoryType
    // this.parentId = this.$route.params.parentId
    this.resourceAction = this.$route.params.resourceAction
    this.fetchData()
  },
  methods: {
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
      this.title = 'Add Step'
    },
    fetchData() {
      getListOfActiveWorkflowType().then(response => {
        this.lists.wfTypes = response.data
      })
      getActiveListOfNotification().then(res => {
        this.lists.notifications = res.data
      })

      getAllListOfValueList().then(res => {
        this.lists.lovs = res.data.content
      })
      getAllRolesList().then(response => {
        this.lists.roles = response.data.content
      }).catch(err => {
        console.error(err)
      })
    },
    addWorkflowStep() {
      this.$refs['wfStepRef'].validate((valid) => {
        if (valid) {
          const wfStep = this.wfSteps
          const decisions = this.finalDecisions
          wfStep.id = 0
          wfStep.decisions = decisions
          this.wfData.steps.push(wfStep)
          this.clearDialog()
        }
      })
    },
    submitForm(formName) {
      createWorkflow(this.wfData)
        .then(response => {
          // debugger
          if (response.code === statusCodes.SUCCESS) {
            this.$message({
              message: 'Workflow Created Successfully.',
              showClose: true,
              type: 'success'
            })
            this.$router.push({ name: 'Workflow.Index' })
          }
        })
        .catch(() => {
          this.$message({
            message: 'Sorry, Something went wrong.',
            showClose: true,
            type: 'error'
          })
        })
    },
    deleteItem(data) {
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
        return this.lists.roles.filter(e => e.id === typeId)[0].name
      } else if (valueType === 'notifications') {
        return this.lists.notifications.filter(e => e.id === typeId)[0].name
      } else if (valueType === 'lovs') {
        return this.lists.lovs.filter(e => e.id === typeId)[0].name
      } else {
        return typeId
      }
    },
    clearDialog() {
      this.title = null
      this.show.stepForm = false
      this.decisions = {
        decision: null,
        notificationTemplateId: null,
        statusId: null
      }
      this.wfSteps = {
        code: null,
        name: null,
        currentRoleID: null,
        applicantNotify: true,
        notifyRoles: [],
        decisions: []
      }
      // this.$refs['wfStepRef'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
