<template>
  <el-tabs v-model="activeTab" :active-name="activeTab" stretch>
    <el-tab-pane name="licence" label="Licence Details">
      <div class="el-descriptions">
        <div class="el-descriptions__body">
          <table>
            <tbody>
              <tr>
                <td>
                  <span class="el-descriptions__label">Associated Product</span>
                  <span class="el-descriptions__content">{{ licenceDetails.product }} </span>
                </td>
                <td v-if="licenceDetails.licenceNumber">
                  <span class="el-descriptions__label"> Licence Number </span>
                  <span class="el-descriptions__content"> {{ licenceDetails.licenceNumber }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Current Licence/Application State</span>
                  <span class="el-descriptions__content"> {{ licenceDetails.licenseState }} </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="el-descriptions__label"> Application Number </span>
                  <span class="el-descriptions__content"> {{ licenceDetails.applicationNumber }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Date of Application Submission </span>
                  <span class="el-descriptions__content"> {{ licenceDetails.submittedAt }} </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="licenceDetails.coverageAreas.length > 0">
        <h4 style="text-decoration: underline">Coverage Areas</h4>
        <el-table
          v-loading="false"
          :data="licenceDetails.coverageAreas"
          element-loading-text="Loading"
          border
          size="small"
          width="200"
          highlight-current-row
        >
          <el-table-column label="ID" align="center" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Name" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="individual" name="individual" label="Additional Details">
      <div class="el-descriptions">
        <div class="el-descriptions__body">
          <table>
            <tbody>
              <tr>
                <td>
                  <span class="el-descriptions__label"> Investment Cost </span>
                  <span class="el-descriptions__content"> {{ individual.investmentCost | toThousandFilter }} <b>{{ individual.investmentCostCurrency }}</b> </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Commencement Date </span>
                  <span class="el-descriptions__content"> {{ individual.commencementDate }} </span>
                </td>
                <td v-if="individual.facilityOwnerCategory">
                  <span class="el-descriptions__label">  Facility Ownership Type</span>
                  <span class="el-descriptions__content"> {{ individual.facilityOwnerCategory.name }} </span>
                </td>
              </tr>
              <tr>
                <td v-if="individual.transmitterFacilityLesser">
                  <span class="el-descriptions__label"> Facility Leaser </span>
                  <span class="el-descriptions__content"> {{ individual.transmitterFacilityLesser }} </span>
                </td>
                <td v-if="individual.requestDescription">
                  <span class="el-descriptions__label"> Request Description</span>
                  <span class="el-descriptions__content"> {{ individual.requestDescription }} </span>
                </td>
                <td v-if="individual.otherRelevantInfo">
                  <span class="el-descriptions__label"> Other relevant information </span>
                  <span class="el-descriptions__content"> {{ individual.otherRelevantInfo }} </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="el-descriptions__label"> Include Spectrum Required? </span>
                  <span class="el-descriptions__content"> {{ individual.includeSpectrumRequired? 'Yes' : 'No' }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Include Spectrum Acquired? </span>
                  <span class="el-descriptions__content"> {{ individual.includeSpectrumAcquired ? 'Yes' : 'No' }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Satellite Uplink Required? </span>
                  <span class="el-descriptions__content"> {{ individual.satelliteUplinkRequired ? 'Yes' : 'No' }} </span>
                </td>

              </tr>
              <tr v-if="individual.satelliteUplinkRequired">
                <td>
                  <span class="el-descriptions__label">  Beaming Satellite Location </span>
                  <span class="el-descriptions__content"> {{ individual.beamingSatelliteLocation }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Beaming Satellite Latitude</span>
                  <span class="el-descriptions__content"> {{ individual.beamingSatelliteLatitude }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Beaming Satellite Longitude</span>
                  <span class="el-descriptions__content"> {{ individual.beamingSatelliteLongitude }} </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="licenceDetails.spectrumValues.length > 0">
        <h4 style="text-decoration: underline">Spectrum Values</h4>
        <el-table
          v-loading="false"
          :data="licenceDetails.spectrumValues"
          element-loading-text="Loading"
          border
          size="small"
          width="200"
          highlight-current-row
        >
          <el-table-column label="ID" align="center" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Lower Band (Mhz)" align="center">
            <template slot-scope="scope">
              {{ scope.row.lowerBand }} Mhz
            </template>
          </el-table-column>
          <el-table-column label="Upper Band (Mhz)" align="center">
            <template slot-scope="scope">
              {{ scope.row.upperBand }} Mhz
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="licenceDetails.resources">
        <h4 style="text-decoration: underline">Spectrum Values</h4>
        <el-table
          v-loading="false"
          :data="licenceDetails.resources"
          element-loading-text="Loading"
          border
          size="small"
          width="200"
          highlight-current-row
        >
          <el-table-column label="ID" align="center" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Code" align="center">
            <template slot-scope="scope">
              {{ scope.row.code }}
            </template>
          </el-table-column>
          <el-table-column label="Name" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { toThousandFilter, globalStatusFilter } from '@/filters'

export default {
  name: 'LicenceDetails',
  filters: {
    toThousandFilter,
    globalStatusFilter

  },
  props: {
    licenceDetails: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeTab: 'licence'
    }
  },
  computed: {
    individual() {
      return this.licenceDetails?.individual
    }
  }
}
</script>

<style scoped>

</style>
