<template>

  <div class="app-container">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="Entity Information" name="entityInformation">
        <el-card>
          <el-form label-position="top" :model="evaluationForm">
            <el-form-item v-for="(item, key) in evaluationForm.entityInformation.subItems" :key="key" :label="item.name">
              <div v-for="(subItem, subKey, subIndex) in item.subItems" :key="subIndex">
                <el-checkbox v-model="subItem.value" :label="subItem.name + ' Is Attached?'" required />
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Business Information" name="businessInformation">
        <el-card>
          <el-form label-position="top" :model="evaluationForm">
            <el-form-item
              v-for="(item, key) in evaluationForm.businessPlanInformation.subItems"
              :key="key"
              :label="item.name"
            >
              <div v-for="(subItem, subKey) in item.subItems" :key="subKey">
                <span>{{ subItem.name }} </span>
                <div v-if="subItem.type === 'EVALUATION'">
                  <el-row :gutter="10">
                    <el-col :md="12" :lg="12">
                      <el-input v-model="subItem.findings" type="textarea" placeholder="STATUS/FINDINGS" label="label in el-input" required />
                    </el-col>
                    <el-col :md="12" :lg="12">
                      <el-input v-model="subItem.remarks" type="textarea" placeholder="REMARKS" label="label in el-input" />
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Financial Information" name="financialInformation">
        <el-card>
          <el-form label-position="top" :model="evaluationForm">
            <el-form-item v-for="(item, key) in evaluationForm.financialInformation.subItems" :key="key" :label="item.name">
              <div v-for="(subItem, subKey) in item.subItems" :key="subKey">
                <span>{{ subItem.name }} </span>
                <div v-if="subItem.type === 'EVALUATION'">
                  <el-row :gutter="10">
                    <el-col :md="12" :lg="12">
                      <el-input v-model="subItem.findings" type="textarea" placeholder="STATUS/FINDINGS" label="label in el-input" />
                    </el-col>
                    <el-col :md="12" :lg="12">
                      <el-input v-model="subItem.remarks" type="textarea" placeholder="REMARKS" label="label in el-input" />
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-button
        plain
        size="mini"
        type="success"
        icon="el-icon-save"
        style="float: right; margin:2rem"
      >Save</el-button>
    </el-row>
  </div>

</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      activeName: 'entityInformation',
      evaluationForm: {
        entityInformation: {
          subItems: [
            {
              name: 'ENTITY CERTIFICATE VERIFICATION',
              subItems: [
                {
                  type: Boolean,
                  name: 'Certificate of incorporation',
                  value: false
                },
                {
                  type: Boolean,
                  name: 'TAXPAYER IDENTIFICATION NUMBER',
                  value: false
                },
                {
                  type: Boolean,
                  name: 'VALID TAX CLEARANCE CERTIFICATE',
                  value: false
                },
                {
                  type: Boolean,
                  name: 'PUBLIC CONSULTATION',
                  value: false
                },
                {
                  type: Boolean,
                  name: 'PRESENTATION OF BUSINESS AND TECHNICAL PLAN',
                  value: false
                }

              ]
            }
          ]
        },
        businessPlanInformation: {
          subItems: [
            {
              name: 'TECHNICAL ASPECT',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'Frequency allocation',
                  remarks: '',
                  findings: ''
                },
                {
                  type: 'EVALUATION',
                  name: 'Numbering resource allocation',
                  remarks: '',
                  findings: ''
                },
                {
                  type: 'EVALUATION',
                  name: 'Hosting of servers primary and backup',
                  remarks: '',
                  findings: ''
                },
                {
                  type: 'EVALUATION',
                  name: 'System security and deployed features',
                  remarks: '',
                  findings: ''
                }

              ],
              hasChildren: false
            },
            {
              name: 'QUALITY OF SERVICE FOR THE SERVICE OFFERED',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'Compliance to Key parameters for quality of ' +
                      'services as stipulated in the fourth schedule of ' +
                      'the Electronic and Postal Communications ' +
                      '(Quality of Service) Regulations, 2018',
                  remarks: '',
                  findings: ''
                }

              ],
              hasChildren: false
            },
            { name: 'SERVICE AREA, SERVICES OFFERED AND NETWORK CONFIGURATION',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'Network Roll out and Geographical coverage',
                  remarks: '',
                  findings: ''
                },
                {
                  type: 'EVALUATION',
                  name: 'Type of services they will provide once issued the licence',
                  remarks: '',
                  findings: ''
                },
                {
                  type: 'EVALUATION',
                  name: 'Network Configuration and Layout',
                  remarks: '',
                  findings: ''
                }

              ],
              hasChildren: false
            }
          ]
        },
        financialInformation: {
          subItems: [
            {
              name: 'BUSINESS CAPITAL',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'Business Capital required for the investment  ',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            },
            {
              name: 'ANALYSIS OF THE PROJECTED FINANCIAL STATEMENT',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'Submission of the Financial statements namely: -\n' +
                      '1.\tIncome statement\n' +
                      '2.\tCash flow statement\n' +
                      '3.\tBalance sheet\n',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            },
            {
              name: 'NET PROFIT MARGIN',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'A range from 10% to 15% is acceptable.\n' +
                      'However, higher ratio results are often more favourable  \n',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            },
            {
              name: 'CURRENT RATIO',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'A ratio of 1 or slightly above is a good indicator',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            },
            {
              name: 'RETURN ON EQUITY',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'Acceptable ratio is anything more than 10%',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            },
            {
              name: 'RETURN ON INVESTMENT RATIO (ROI)',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'A Positive ROI is preferably as it indicates a profitable business.' +
                      ' While a negative ROI indicates unprofitable projects',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            },
            {
              name: 'REVENUE GROWTH TREND FOR THE 5 YEARS',
              subItems: [
                {
                  type: 'EVALUATION',
                  name: 'The average growth should fall between 5% to 10% for year over year.' +
                      ' However, any positive trend/growth would suffice  ',
                  remarks: '',
                  findings: ''
                }
              ],
              hasChildren: false
            }
          ]

        }
      }
    }
  }
}
</script>
