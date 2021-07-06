<template>
  <!--  close-on-click-modal-->
  <div class="app-container">
    <el-row v-if="showSaveDraftButton">
      <el-button plain size="mini" icon="el-icon-edit" type="primary" style="float: right" @click.prevent="saveAsDraft"> Save as Draft </el-button>
    </el-row>
    <el-tabs v-model="activeName" tab-position="top">
      <el-tab-pane v-for="(Section, subKey, subIndex) in finalEvaluationForm.items" :key="Section.name" :label="Section.displayName" :name="subIndex">
        <el-row v-for="SubSection in Section.items" :key="SubSection.name">
          <h3 style="text-align: center; text-decoration: underline"> {{ SubSection.displayName }} </h3>
          <!-- Create the holding for the items  -->
          <div v-for="Item in SubSection.items" :key="Item.id">
            <h4 style="text-align: left"> {{ Item.displayName }} </h4>
            <!--  Create Template to hold parameters  -->
            <div v-for="parameter in Item.items" :key="parameter.id">
              <p> <b> {{ parameter.name }} </b>  </p>
              <div v-if="parameter.flag === 'PARAMETER'">
                <el-row :gutter="10">
                  <!--  check if the feedbackType -> 'DYNAMIC' - then show status text area  -->
                  <el-col v-if="parameter.feedbackType === 'DYNAMIC'" :md="12" :lg="12">
                    <el-input v-model="parameter.finding" type="textarea" placeholder="STATUS/FINDINGS" label="label in el-input" :readonly="!showSaveDraftButton" />
                  </el-col>
                  <!--  check if the feedbackType -> 'FIXED' - then show radio choices  -->
                  <el-col v-else-if="parameter.feedbackType === 'FIXED'" :md="12" :lg="12">
                    <el-radio-group v-model="parameter.finding">
                      <el-radio v-for="(enumItem, enumKey) in parameter.options" :key="enumKey" :value="enumItem.name" :label="enumItem.name" :readonly="!showSaveDraftButton">{{ enumItem.name }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <!--  check if the feedbackType -> 'EVALUATION'-- add remarks  -->
                  <el-col v-if="parameter.feedbackType !== 'NONE' && (finalEvaluationForm.formType === 'EVALUATION' || finalEvaluationForm.type === 'EVALUATION')" :md="12" :lg="12">
                    <el-input v-model="parameter.remarks" type="textarea" placeholder="REMARKS" label="label in el-input" :readonly="!showSaveDraftButton" />
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'DynamicForm',
  props: {
    formDetails: {
      type: Object,
      default: () => {}
    },
    taskName: {
      type: String,
      default: ''
    },
    sendSaveSignal: {
      type: Boolean,
      default: false
    },
    showSaveDraftButton: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      activeName: 0,
      computedVisibleDialog: true,
      bagOfHolding: []
    }
  },
  computed: {
    finalEvaluationForm() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.formDetails
    },
    computedSendSaveSignal() {
      return this.sendSaveSignal
    },
    computedTaskName() {
      return this.taskName
    }
  },
  watch: {
    finalEvaluationForm: {
      handler: function(newValue, oldValue) {
        console.log('changes ')
        if (newValue === true) {
          // save form
          this.saveForm()
        }
      },
      deep: true
    },
    computedSendSaveSignal: {
      handler: function(newValue, oldVal) {
        if (newValue) {
          this.saveAsDraft()
        }
        // console.log(oldVal)
        // console.log(newValue)
      }
    }
  },
  methods: {
    showSaveAsDraftDialog(done) {
      this.$confirm('You have unsaved changes, save and proceed?', 'Confirm', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Discard Changes'
      })
        .then(() => {
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
              ? 'Changes discarded. Proceeding to a new route.'
              : 'Stay in the current route'
          })
        })
    },
    saveForm() {
      console.log('saving form')
    },
    saveAsDraft() {
      this.showLoading = true
      this.sendToBag(this.finalEvaluationForm.items)
      this.bagOfHolding = this.resultsETL(this.bagOfHolding)
      this.updateFormAsDraft()
    },
    updateFormAsDraft() {
      return this.$emit('updateFormAsDraft', this.bagOfHolding)
    },
    removeAndAddToBag(userData) {
      this.bagOfHolding.push(userData)
      return true
    },
    resultsETL(data) {
      return data.filter(item => item.finding && item.finding !== '')
    },
    sendToBag(sentData) {
      sentData.forEach(item => {
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
    }
  }
}
</script>
