<template>
  <el-tabs v-model="activeTab" :active-name="activeTab" stretch>
    <el-tab-pane name="entity" label="Company Details">
      <div class="el-descriptions">
        <div class="el-descriptions__body">
          <table class="">
            <tbody>
              <tr>
                <td>
                  <span class="el-descriptions__label">Entity Name</span>
                  <span class="el-descriptions__content">{{ entityDetails.name | defaultNull }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">Entity Type</span>
                  <span class="el-descriptions__content">{{ entityDetails.categoryName | defaultNull }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">TIN No.</span>
                  <span class="el-descriptions__content">{{ entityDetails.tinNo | defaultNull }}</span>
                </td>
              </tr>
              <tr>

                <td>
                  <span class="el-descriptions__label"> Business Licence No. </span>
                  <span class="el-descriptions__content">{{ entityDetails.businessLicenceNo | defaultNull }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Reg. Certificate No. </span>
                  <span class="el-descriptions__content">{{ entityDetails.regCertNo | defaultNull }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Phone No. </span>
                  <span class="el-descriptions__content">{{ entityDetails.phone | defaultNull }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="el-descriptions__label">Email Address</span>
                  <span class="el-descriptions__content">{{ entityDetails.email | defaultNull }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">P.O.Box</span>
                  <span class="el-descriptions__content"> {{ entityDetails.postalAddress | defaultNull }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label">Fax</span>
                  <span class="el-descriptions__content">{{ entityDetails.fax | defaultNull }}</span>
                </td>
              </tr>
              <tr>
                <td v-if="entityDetails.website">
                  <span class="el-descriptions__label">Website</span>
                  <span class="el-descriptions__content">{{ entityDetails.website | defaultNull }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">Address</span>
                  <span class="el-descriptions__content">{{ computedAddress | defaultNull }}</span>
                </td>
                <td>
                  <span class="el-descriptions__label">Physical Address</span>
                  <span class="el-descriptions__content">{{ entityDetails.physicalAddress | defaultNull }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <h4> List of Shareholders </h4>
          <el-table :data="entityDetails.shareholders" size="small" fit highlight-current-row border>
            <el-table-column label="Shareholder Name" prop="fullname" />
            <el-table-column label="Nationality" prop="nationality" />
            <el-table-column label="Percentage of Shares" prop="shares" />
          </el-table>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane name="applicant" label="Applicant Details">
      <div class="el-descriptions">
        <div class="el-descriptions__body">
          <table>
            <tbody>
              <tr>
                <td>
                  <span class="el-descriptions__label"> First Name </span>
                  <span class="el-descriptions__content"> {{ applicantDetails.firstName | defaultNull }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label">Middle Name </span>
                  <span class="el-descriptions__content">{{ applicantDetails.middleName | defaultNull }}  </span>
                </td>
                <td>
                  <span class="el-descriptions__label"> Last Name</span>
                  <span class="el-descriptions__content">{{ applicantDetails.lastName | defaultNull }}  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="el-descriptions__label">Email Address</span>
                  <span class="el-descriptions__content"> {{ applicantDetails.email | defaultNull }} </span>
                </td>
                <td>
                  <span class="el-descriptions__label">Phone No.</span>
                  <span class="el-descriptions__content">{{ applicantDetails.phone | defaultNull }} </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defaultNull, uppercaseFirst } from '@/filters'

export default {
  name: 'CompanyDetails',
  filters: {
    defaultNull
  },
  props: {
    companyDetails: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeTab: 'entity'
    }
  },
  computed: {
    computedAddress() {
      // const a = 'post-code ' + this.entityDetails.postalCode ? this.entityDetails.postalCode + ',' : '' + this.entityDetails.ward ?? '' + this.entityDetails.region ?? '' + this.entityDetails.country ?? ''
      const postcode = this.entityDetails.postalCode ? `postal-code: ${this.entityDetails.postalCode}, ` : ''
      const ward = this.entityDetails.ward ? ` ${this.entityDetails.ward},` : ''
      const region = this.entityDetails.region ? ` ${this.entityDetails.region},` : ''
      const country = this.entityDetails.country ? ` ${uppercaseFirst(this.entityDetails.country)}` : ''

      return postcode + ward + region + country
    },
    entityDetails() {
      return this.companyDetails.entity
    },
    applicantDetails() {
      return this.companyDetails?.creator
    }
  }
}
</script>

<style scoped>

</style>
