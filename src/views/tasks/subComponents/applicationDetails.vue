<template>
  <div>
    <el-row>
      <div class="el-descriptions">
        <div class="el-descriptions__header">
          <div>
            <h3 style="text-decoration: underline">  Company Details</h3>
          </div>
          <div class="el-descriptions__extra" />
        </div>
        <div class="el-descriptions__body">
          <table class="">
            <tbody>
              <tr v-if="licenceDetails.entity">

                <td colspan="2">
                  <span class="el-descriptions__label">Entity Name</span>
                  <span class="el-descriptions__content">{{ licenceDetails.entity.name }}</span>
                </td>
                <td colspan="2">
                  <span class="el-descriptions__label">Entity Type</span>
                  <span class="el-descriptions__content">{{ licenceDetails.entity.categoryName | defaultNull }}</span>
                </td>
                <td colspan="2">
                  <span class="el-descriptions__label">TIN No.</span>
                  <span class="el-descriptions__content">{{ licenceDetails.entity.tinNo | defaultNull }}</span>
                </td>
                <td v-if="licenceDetails.entity.businessLicenceNo" colspan="2">
                  <span class="el-descriptions__label">Business Reg. No.</span>
                  <span class="el-descriptions__content">{{ licenceDetails.entity.businessLicenceNo }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="el-descriptions__label">Licence State</span>
                  <span class="el-descriptions__content">
                    <el-tag :type="licenceDetails.licenseState | statusFilter">{{ licenceDetails.licenseState | defaultNull }} </el-tag>
                  </span>
                </td>
                <td colspan="2">
                  <span class="el-descriptions__label">Entity Email</span>
                  <span class="el-descriptions__content">{{ licenceDetails.entity.email }}</span>
                </td>
                <td colspan="1">
                  <span class="el-descriptions__label">Submission Date</span>
                  <span class="el-descriptions__content">{{ licenceDetails.submittedAt | defaultNull }}</span>
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
              @click.prevent="viewMoreEntityDetails = true"
            >
              {{ viewMoreEntityDetails ? 'Less' : 'More' }}
              <i class="el-icon-more-outline" />
            </el-button>
            <el-button
              plain
              size="mini"
              type="success"
              style="float: right; margin-right: 20px"
              @click.prevent="viewActorsNotActed = true"
            >
              View current Actor
            </el-button>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="applicationType === 'LICENCE'">
      <div class="el-descriptions">
        <div class="el-descriptions__header">
          <el-col :span="12">
            <h3 style="text-decoration: underline">  Licence Details</h3>

          </el-col>
          <el-col :span="12" style="text-align: right;" class="pr-3">
            <el-button v-if="licenceDetails.licenceCertificateUri" size="mini" type="primary" style="float: right" plain icon="el-icon-view" @click="viewLicence(licenceDetails.licenceCertificateUri)">
              View Licence
            </el-button>
          </el-col>
          <div class="el-descriptions__extra" />
        </div>
        <div class="el-descriptions__body">
          <table class="">
            <tbody>
              <tr>
                <td>
                  <span class="el-descriptions__label">Licence Product</span>
                  <span class="el-descriptions__content">{{ licenceDetails.product }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">Status</span>
                  <span class="el-descriptions__content"><el-tag type="primary" size="large">{{ licenceDetails.status }} </el-tag></span>
                </td>
              </tr>
              <tr>
                <td v-if="licenceDetails.issueDate">
                  <span class="el-descriptions__label">Licence Issue Date</span>
                  <span class="el-descriptions__content">{{ licenceDetails.issueDate.split('T')[0] }}</span>
                </td>
                <td v-if="licenceDetails.expireDate">
                  <span class="el-descriptions__label">Licence Expiry Date</span>
                  <span class="el-descriptions__content">{{ licenceDetails.expireDate.split('T')[0] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <el-row style="margin-top: 5px !important;">
            <template v-permission="['ROLE_LICENCE_CANCELLATION']">
              <el-button
                v-if="licenceDetails.licenseState === 'ACTIVE' || licenceDetails.licenseState === 'SUSPENDED'"
                plain
                size="mini"
                type="danger"
                style="float: right; margin-right: 20px"
                @click="initiateLicenceCancellation"
              >
                Cancel Licence
              </el-button>
            </template>
            <el-button
              plain
              size="mini"
              type="primary"
              style="float: right; margin-right: 20px"
              @click="viewMoreLicenceDetails = true"
            >
              {{ viewMoreLicenceDetails ? 'Less' : 'More' }}
              <i class="el-icon-more-outline" />
            </el-button>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="applicationType === 'ENTITY' ">

      <div class="el-descriptions">
        <div class="el-descriptions__header">
          <el-col :span="12">
            <h3 style="text-decoration: underline">  Entity Application Details</h3>

          </el-col>
          <el-col :span="12" style="text-align: right;" class="pr-3">
            <!--            <el-button v-if="licenceDetails.licenceCertificateUri" size="mini" type="primary" style="float: right" plain icon="el-icon-view" @click="viewLicence(licenceDetails.licenceCertificateUri)">-->
            <!--              View Licence-->
            <!--            </el-button>-->
          </el-col>
          <div class="el-descriptions__extra" />
        </div>
        <div class="el-descriptions__body">
          <table class="">
            <tbody>
              <tr>
                <td>
                  <span class="el-descriptions__label">Entity Product</span>
                  <span class="el-descriptions__content">{{ licenceDetails.product }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">Status</span>
                  <span class="el-descriptions__content"><el-tag type="primary" size="large">{{ licenceDetails.status }} </el-tag></span>
                </td>
              </tr>
              <tr>
                <td v-if="licenceDetails.issueDate">
                  <span class="el-descriptions__label">Licence Issue Date</span>
                  <span class="el-descriptions__content">{{ licenceDetails.issueDate.split('T')[0] | defaultNull }}</span>
                </td>
                <td v-if="licenceDetails.expireDate">
                  <span class="el-descriptions__label">Licence Expiry Date</span>
                  <span class="el-descriptions__content">{{ licenceDetails.expireDate.split('T')[0] | defaultNull }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <!--          <el-row style="margin-top: 5px !important;">-->
          <!--            <template v-permission="['ROLE_LICENCE_CANCELLATION']">-->
          <!--              <el-button-->
          <!--                v-if="licenceDetails.licenseState === 'ACTIVE' || licenceDetails.licenseState === 'SUSPENDED'"-->
          <!--                plain-->
          <!--                size="mini"-->
          <!--                type="danger"-->
          <!--                style="float: right; margin-right: 20px"-->
          <!--                @click="initiateLicenceCancellation"-->
          <!--              >-->
          <!--                Cancel Licence-->
          <!--              </el-button>-->
          <!--            </template>-->
          <!--            <el-button-->
          <!--              plain-->
          <!--              size="mini"-->
          <!--              type="primary"-->
          <!--              style="float: right; margin-right: 20px"-->
          <!--              @click="viewMoreLicenceDetails = true"-->
          <!--            >-->
          <!--              {{ viewMoreLicenceDetails ? 'Less' : 'More' }}-->
          <!--              <i class="el-icon-more-outline" />-->
          <!--            </el-button>-->
          <!--          </el-row>-->
        </div>
      </div>

    </el-row>
    <el-row v-if="licenceDetails.services">
      <h4 style="text-decoration: underline">Service List</h4>
      <el-table
        v-loading="false"
        :data="licenceDetails.services"
        element-loading-text="Loading"
        border
        fit
        size="small"
        highlight-current-row
      >
        <el-table-column label="ID" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Service Name" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Service Code" align="left">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row v-if="licenceDetails.bills">
      <h4 style="text-decoration: underline">Billing List</h4>
      <el-table
        v-loading="false"
        :data="licenceDetails.bills"
        element-loading-text="Loading"
        border
        fit
        size="small"
        highlight-current-row
      >
        <el-table-column label="ID" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Bill Amount" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.amount | toThousandFilter }} <b>{{ scope.row.currency }}</b> </span>
          </template>
        </el-table-column>
        <el-table-column label="Billing No." align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.billingNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Control No." align="left">
          <template slot-scope="scope">
            {{ scope.row.controlNumber }}
          </template>
        </el-table-column>
        <el-table-column label="Charges" type="expand" width="90">
          <template slot-scope="scope">
            <h3> Charges </h3>
            <p v-for="(i, index) in scope.row.charges" :key="index"> {{ index + 1 }}. <b>Fee Type:</b> {{ i.feeType }} | <b>Amount:</b> {{ i.amount | toThousandFilter }} <b>{{ i.currency }} </b> | <b>Status:</b> {{ i.status }} </p>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Payment Date" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.paidAt }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="Actor(s)" :visible.sync="viewActorsNotActed" width="65%">
      <el-table
        v-loading="false"
        :data="filteredTrackDetails"
        element-loading-text="Loading"
        border
        fit
        size="small"
        highlight-current-row
      >
        <el-table-column label="ID" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Name" prop="actor" />
        <el-table-column label="Role" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.actorRole.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action" prop="stepName" />
      </el-table>
    </el-dialog>
    <el-dialog title="Initiate Licence Cancellation" :visible.sync="viewCancellationDialog" width="50%">
      <el-form ref="cancellationForm" :model="cancellationForm" label-position="top">
        <el-form-item
          label="Cancellation Reason"
          prop="reason"
          :rules="[{ required: true, message: 'Please enter the reason for cancellation', trigger: 'blur' }]"
        >
          <el-input v-model="cancellationForm.reason" name="reason" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain size="mini" @click="viewCancellationDialog = false">Cancel</el-button>
        <el-button plain size="mini" type="primary" @click="submitCancellation">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Company Details" :visible="viewMoreEntityDetails" width="75%" :append-to-body="true" :before-close="closeModal">
      <company-details :company-details="licenceDetails" />
    </el-dialog>
    <el-dialog title="Licence Details" :visible="viewMoreLicenceDetails" width="75%" :append-to-body="true" :before-close="closeModal">
      <licence-details :licence-details="licenceDetails" />
    </el-dialog>
  </div>
</template>

<script>
import { defaultNull, statusFilter, toThousandFilter } from '@/filters'
import { initiateCancellationOfLicence } from '@/api/licences'
import { statusCodes } from '@/utils/status-codes'
import CompanyDetails from '@/views/tasks/subComponents/companyDetails'
import LicenceDetails from '@/views/tasks/subComponents/licenceDetails'

export default {
  name: 'ApplicationDetails',
  components: {
    LicenceDetails,
    CompanyDetails
  },
  filters: {
    statusFilter,
    toThousandFilter,
    defaultNull
  },
  props: {
    licenceDetails: {
      type: Object,
      default: () => {}
    },
    licenceId: {
      type: Number,
      default: () => 0
    },
    applicationType: {
      type: String,
      default: () => 'LICENCE'
    }
  },
  data() {
    return {
      viewCancellationDialog: false,
      cancellationForm: {
        reason: '',
        licenceId: 0
      },
      viewActorsNotActed: false,
      showMoreDetails: false,
      showMoreDetails2: false,
      viewMoreEntityDetails: false,
      viewMoreLicenceDetails: false
    }
  },
  computed: {
    hasSpectrumValues() {
      return this.licenceDetails.spectrumValues && this.licenceDetails?.spectrumValues?.length > 0
    },
    filteredTrackDetails() {
      return this.licenceDetails?.track?.filter(e => e.isActed === false)
    }
  },
  methods: {
    mapCoverageAreas() {
      return this.licenceDetails.coverageAreas?.map(e => e.name)
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
              this.refreshData()
            }
          })
        }
      })
    },
    refreshData() {
      this.$emit('requestPageRefresh', true)
    },
    viewLicence(pdfUri) {
      this.$emit('viewGeneratedLicence', pdfUri)
    },
    closeModal(data) {
      this.viewMoreEntityDetails = false
      this.viewMoreLicenceDetails = false
    }
  }
}
</script>

<style scoped>

</style>
