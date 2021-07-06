<template>
  <div class="app-container">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane
        v-for="(MajorItem, MajorKey, MajorIndex) in evaluationForm"
        :key="MajorIndex"
        :label="camelToSpace(MajorKey)"
        :name="MajorKey"
      >
        <el-card>
          <el-form label-position="top" :model="evaluationForm">
            <el-form-item v-for="(item, key, index) in MajorItem.subItems" :key="key" :label="item.name">
              <div v-for="(subItem, subKey) in item.subItems" :key="subKey">
                <span>{{ subItem.name }} </span>
                <template v-if="subItem.type === 'STRING_FILL'">
                  <el-input v-model="subItem.value" type="text" />
                </template>
                <div v-if="subItem.type === 'RADIO' ">
                  <el-radio-group v-model="subItem.value">
                    <el-radio v-for="(enumItem, enumKey) in subItem.enums" :key="enumKey" :label="enumItem">{{ enumItem }}</el-radio>
                  </el-radio-group>
                </div>
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
      <el-button type="success" icon="el-icon-save" style="float: right; margin:2rem">Save</el-button>
    </el-row>
  </div>
</template>

<script>
import { camelToSpace } from '@/utils'
export default {
  name: 'PermitForm',

  data: function() {
    return {
      activeName: 'studioInformation',
      evaluationForm: {
        studioInformation: {
          subItems: [
            {
              name: 'Building',
              subItems: [
                {
                  type: 'STRING_FILL',
                  name: 'Physical Address',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Standby Power',
                  enums: ['Available', 'Not Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Building Type',
                  enums: ['Residential', 'Non-Residential'],
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Transmitter Type ',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Transmitter (Make and Type)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Transmitter Output Power',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'STL Transmitter Location',
                  enums: ['Inside Studios Room ', 'Separate Room']
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Transmitter',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Transmitter Geographical Coordinates',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Building Security',
                  enums: ['Available', 'Not Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Is Building Fenced?',
                  enums: ['Fenced', 'Not Fenced'],
                  value: ''
                }
              ]
            },
            {
              name: 'ON-AIR Studio Amenities',
              subItems: [
                {
                  type: 'STRING_FILL',
                  name: 'ON-AIR Studio Width (Metres)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'ON-AIR Studio Length (Metres)',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Mixer(s)/Console Desk',
                  enums: ['Good', 'Satisfactory', 'Poor', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Mixer(s)/Console Desk',
                  enums: ['Good', 'Satisfactory', 'Poor', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Microphones',
                  enums: ['Good', 'Satisfactory', 'Poor', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Acoustic treatment',
                  enums: ['Good', 'Satisfactory', 'Poor', 'No Acoustic'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'On-Air Lamp',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Air-Conditioning',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Studio telephone and telephone hybrid',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Professional Watch',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                }

              ]
            },
            {
              name: 'PRODUCTION Studio ',
              subItems: [
                {
                  type: 'RADIO',
                  name: 'Production Studio Available',
                  enums: ['Available', 'Not-Available'],
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'ON-AIR Studio Width (Metres)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'ON-AIR Studio Length (Metres)',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Mixer(s)/Console Desk',
                  enums: ['Good', 'Satisfactory', 'Poor', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Mixer(s)/Console Desk',
                  enums: ['Good', 'Satisfactory', 'Poor', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Microphones',
                  enums: ['Good', 'Satisfactory', 'Poor', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Acoustic treatment',
                  enums: ['Good', 'Satisfactory', 'Poor', 'No Acoustic'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'On-Air Lamp',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Air-Conditioning',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Professional Watch',
                  enums: ['Installed', 'Not-Installed'],
                  value: ''
                }

              ]
            },
            {
              name: 'News and Staff Room',
              subItems: [
                {
                  type: 'RADIO',
                  name: 'News and Staff Room Available',
                  enums: ['Available', 'Not-Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Set Up and Facilities',
                  enums: ['Good', 'Satisfactory', 'Poor'],
                  value: ''
                }
              ]
            },
            {
              name: 'Additional Amenities',
              subItems: [
                {
                  type: 'RADIO',
                  name: 'Library/Storage Available',
                  enums: ['Available', 'Not-Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Reception Available',
                  enums: ['Available', 'Not-Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Control Room Available',
                  enums: ['Available', 'Not-Available'],
                  value: ''
                }
              ]
            }

          ]
        },
        transmissionSite: {
          subItems: [
            {
              name: 'Location',
              subItems: [
                {
                  type: 'STRING_FILL',
                  name: 'Site Name (And Physical Address)',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Area',
                  enums: ['Residential', 'Non-Residential'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Security',
                  enums: ['Available', 'Not Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Is Fenced?',
                  enums: ['Fenced', 'Not Fenced'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Washroom Available',
                  enums: ['Available', 'Not Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Any complaints related to  the presence of the transmitter:',
                  enums: ['YES', 'NO'],
                  value: ''
                }
              ]
            },
            {
              name: 'Tower',
              subItems: [
                {
                  type: 'RADIO',
                  name: 'Ownership',
                  enums: ['Owned', 'Leased'],
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Owner (If Leased)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Height from the ground',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Is Painted?',
                  enums: ['Painted', 'Not Painted'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Support Mechanism',
                  enums: ['Self-Supported', 'Guyed-Mast'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Aircraft Warning Lights',
                  enums: ['Installed', 'Not Installed'],
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Tower Geographical Coordinates',
                  value: ''
                }
              ]
            },
            {
              name: 'Transmitter Equipment',
              subItems: [
                {
                  type: 'RADIO',
                  name: 'Output Filter Installed?',
                  enums: ['Installed', 'Not Installed'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Standby Power',
                  enums: ['Available', 'Not Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Is Equipment Sheltered?',
                  enums: ['YES', 'NO'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Station Type',
                  enums: ['Main', 'Booster'],
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Assigned Frequency',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Make and Type of Transmitter',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Operating Frequency',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Operating output power ',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Maximum Transmitter power ',
                  value: ''
                }
              ]
            },
            {
              name: 'Antenna and STL Equipment',
              subItems: [
                {
                  type: 'STRING_FILL',
                  name: 'Antenna Make and Type',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Number of antenna (dipoles)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Antenna gain (dBi)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Antenna height from the ground (Metres)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Receiver Make and Type ',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'STL Receiver Operating Frequency',
                  value: ''
                }
              ]
            }

          ]
        },
        contents: {
          subItems: [
            {
              name: 'Content and Policy',
              subItems: [
                {
                  type: 'STRING_FILL',
                  name: 'Distribution Local (%)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Distribution Foreign (%)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Distribution Commissioned (%)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Distribution Syndicated (%)',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Hours of Operation (Hrs)',
                  value: ''
                }
              ]
            }
          ]

        },

        HumanResourceAndDevelopmentPlan: {
          subItems: [
            {
              name: 'Human Resource and Development Plan (HRDP)',
              subItems: [
                {
                  type: 'STRING_FILL',
                  name: 'Number of Directors/Managers/Editor',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Number of Presenters/Announcers',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Number of Journalists',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Number of Technicians',
                  value: ''
                },
                {
                  type: 'STRING_FILL',
                  name: 'Minimum Staff Qualifications',
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Code of Conducts',
                  enums: ['Available', 'Not Available'],
                  value: ''
                },
                {
                  type: 'RADIO',
                  name: 'Development Plan in place?',
                  enums: ['YES', 'NO'],
                  value: ''
                }
              ]
            }
          ]

        }

      }
    }
  },
  methods: {
    camelToSpace
  }
}

</script>

<style scoped>

</style>
