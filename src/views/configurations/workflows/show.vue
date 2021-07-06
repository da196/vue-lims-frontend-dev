<template>
  <div class="app-container">
    <div v-loading="listLoading">
      <el-row class="pb-2">
        <el-col v-if="workflow.active" :span="2">
          <el-tag class="success-text" size="">
            {{ workflow.active ?'Active':'Deactived' }}
          </el-tag>
        </el-col>
        <el-col :span="18">
          <span>{{ workflow.name }} &nbsp;<el-tag size="mini">{{ workflow.workflowType.name }}</el-tag></span>
        </el-col>
        <el-col :span="4">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEdit"
          />
          <el-button
            v-if="! workflow.active"
            size="mini"
            type="primary"
            icon="el-icon-circle-check"
            @click="toggleStatus"
          >Activate
          </el-button>
          <el-button v-else size="mini" type="danger" icon="el-icon-circle-close" @click="toggleStatus">Deactivate
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-tabs v-model="tab.active" @tab-click="handleClick">
          <el-tab-pane label="Workflow Details" name="first">
            <el-row>
              <div class="el-descriptions">
                <el-col :span="20">
                  <el-row v-for="(value,key) in workflow" :key="key" class="pb-2">
                    <el-col v-if="! ['steps', 'id', 'links'].includes(key)" :span="8">
                      {{ key }}
                    </el-col>
                    <el-col v-if="! ['steps', 'id', 'links', 'workflowType'].includes(key)" :span="16">
                      <b>{{ value }}</b>
                    </el-col>
                    <el-col v-else-if="['workflowType'].includes(key)" :span="12">
                      <el-row v-for="(v, k) in value" :key="k">
                        <el-col :span="12">{{ k.toUpperCase() }}</el-col>
                        <el-col :span="12"><b>{{ v }}</b></el-col>
                      </el-row>
                    </el-col>

                  </el-row>
                </el-col>
                <el-col :span="4">
                  &nbsp;
                </el-col>
              </div>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Workflow Steps" name="second">
            <el-row>
              <el-col :span="24">
                <el-timeline>
                  <el-timeline-item
                    v-for="(step) in workflow.steps"
                    :key="step.stepNumber"
                    :timestamp="addDay(step.stepNumber).toDateString()"
                    :hide-timestamp="true"
                  >
                    <template>
                      <el-card v-if="step.stepType==='NORMAL'">
                        <p>{{ step.stepNumber }}. <strong>{{ step.name }}</strong></p>
                        <p>Step Type: <b>{{ step.stepType }}</b></p>
                        <p>Step Due Days: <b>{{ step.dueDays }}</b></p>
                        <p>Actor Role: <b>{{ nullableCheck(step.currentRole, 'name') }} ({{ nullableCheck(step.currentRole, 'code') }})</b></p>
                        <p>Notify Applicant <b>{{ step.applicantNotify ? 'Yes' : 'No' }}</b></p>
                        <ul>
                          <li v-for="(decision, k) in step.decisions" :key="k">
                            Decision: <b>{{ decision.decision }}</b> <br>
                            Notification: <b>{{ notificationTemplateDisplayName(decision) }}</b>
                            Status: <b>{{ nullableCheck(decision.licenceStatus, 'name') }}</b>
                          </li>
                        </ul>
                      </el-card>
                      <el-card v-if="step.stepType==='PAYMENT'">
                        <p>{{ step.stepNumber }}. <strong>{{ step.name }}</strong></p>
                        <p>Step Type: <b>{{ step.stepType }}</b></p>
                        <p>Notify Applicant <b>{{ step.applicantNotify ? 'Yes' : 'No' }}</b></p>
                        <p>Applicable State: <b>{{ step.applicableState }}</b></p>
                        <ul>
                          <li v-for="(decision, k) in step.decisions" :key="k">
                            Decision: <b>{{ decision.decision }}</b> <br>
                            Notification: <b>{{ notificationTemplateDisplayName(decision) }}</b>
                            Status: <b>{{ nullableCheck(decision.licenceStatus, 'name') }}</b>
                          </li>
                        </ul>
                      </el-card>
                      <el-card v-if="step.stepType==='DOCUMENT_GENERATION'">
                        <p>{{ step.stepNumber }}. <strong>{{ step.name }}</strong></p>
                        <p>Step Type: <b>{{ step.stepType }}</b></p>
                        <p>Document Type: <b>{{ nullableCheck(step.attachmentType, 'name') }}</b></p>
                        <ul>
                          <li v-for="(decision, k) in step.decisions" :key="k">
                            Decision: <b>{{ decision.decision }}</b> <br>
                            Notification: <b>{{ notificationTemplateDisplayName(decision) }}</b>
                            Status: <b>{{ nullableCheck(decision.licenceStatus, 'name') }}</b>
                          </li>
                        </ul>
                      </el-card>
                    </template>
                  </el-timeline-item>
                </el-timeline>

              </el-col>
              <el-col :span="0" />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  findWorkflowById, getActiveListOfNotification, getAllListOfValueList, getListOfActiveWorkflowType
} from '@/api/configurations'
import { decodeHashId, encodeHashId } from '@/utils'
import { getAllRolesList } from '@/api/user'
// import { gql } from 'apollo-boost'

export default {
  components: {},
  filters: {},

  data() {
    return {
      list: null,
      listLoading: true,
      workflow: {
        name: 'Loading ...',
        status: 0,
        workflowType: {
          name: ''
        },
        steps: [{
          stepNumber: 0,
          internalNotify: false,
          currentRole: {
            name: ''
          },
          name: '',
          decisions: []
        }]
      },
      tab: {
        active: 'first'
      },
      resource: {
        id: 0,
        data: {}
      },
      lists: {
        notifications: [],
        lovs: [],
        wfTypes: []
      }
    }
  },
  // apollo: {
  //   works: gql`query {
  //     getLicences(count: 5) {
  //       id
  //       declaration
  //       isDraft
  //       licenseProduct{
  //         name
  //       }
  //     }
  //   }`
  // },
  computed: {

  },
  created() {
    this.resource.id = decodeHashId(this.$route.params.Id)[0]
    this.fetchData()
  },
  methods: {
    nullableCheck(object, attribute) {
      if (object === null || object === undefined) return `No ${attribute}`
      return object[attribute]
    },
    notificationTemplateDisplayName(decision) {
      return decision?.notificationTemplate?.displayName
    },
    fetchData() {
      this.listLoading = true
      findWorkflowById(this.resource.id).then(response => {
        this.workflow = response.data
        this.workflow.steps = this.workflow.steps.sort((a, b) => a.stepNumber - b.stepNumber)
        this.listLoading = false
      }).catch(error => {
        console.error(error)
      })

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
    mapValueTypeById(typeId, valueType) {
      if (valueType === 'roles') {
        return this.lists.roles.filter(e => e.id === typeId)[0]?.name
      } else if (valueType === 'notifications') {
        return this.lists.notifications.filter(e => e.id === typeId)[0]?.name
      } else if (valueType === 'lovs') {
        return this.lists.lovs.filter(e => e.id === typeId)[0]?.name
      } else {
        return typeId
      }
    },
    toggleStatus() {
      const confirm = window.confirm('Are you sure?')
      if (confirm) {
        // this.workflow.active
        const status = !this.workflow.active
        console.log(`Changing status active to ${status}`)
      }
    },
    addDay(days) {
      const date = new Date(Date.now().valueOf())
      date.setDate(date.getDate() + days)
      return date
    },
    showEdit() {
      const encodedId = encodeHashId(this.workflow.id)
      this.$router.push({ name: 'Workflow.Edit', params: { Id: encodedId }})
    },
    handleClick() {
    }
  }
}
</script>

<style scoped lang="scss">

</style>
