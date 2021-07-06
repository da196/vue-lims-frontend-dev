
<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    label-position="left"
  >
    <el-form-item label="Client Name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="Phone No." prop="phone_number">
      <el-input v-model="ruleForm.phone_number" />
    </el-form-item>
    <el-form-item label="Parcel Type" prop="parcel_type" required>
      <el-select v-model="ruleForm.parcel_type" placeholder="Parcel Category">
        <el-option label="Electronics" value="ELECTRONICS" />
        <el-option label="Clothing" value="CLOTHING" />
        <el-option label="Mixed" value="MIXED" />
      </el-select>
    </el-form-item>
    <el-form-item label-width="0">
      <el-col :span="12">
        <el-form-item label="Cargo Origin" prop="country_of_origin">
          <el-select
            v-model="ruleForm.country_of_origin"
            placeholder="Cargo Origin"
            filterable
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Destination" prop="country_of_destination">
          <el-select
            v-model="ruleForm.country_of_destination"
            placeholder="Cargo Destination"
            filterable
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="Delivery Alerts" prop="delivery">
      <el-switch v-model="ruleForm.delivery" />
    </el-form-item>
    <el-form-item label="Weight (KG)" prop="weight" required>
      <el-input-number
        v-model="ruleForm.weight"
        :precision="1"
        :step="0.1"
        :min="0"
      />
    </el-form-item>
    <el-form-item label="Remarks" prop="remarks">
      <el-input v-model="ruleForm.remarks" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button
        plain
        size="mini"
        type="primary"
        @click="submitForm('ruleForm')"
      >Create</el-button>
      <el-button
        plain
        size="mini"
        @click="resetForm('ruleForm')"
      >Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        parcel_type: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        remarks: '',
        phone_number: '',
        country_of_destination: '',
        country_of_origin: '',
        weight: 0,
        cargoType: ['MIXED', 'CLOTHING', 'ELECTRONICS']
      },
      cities: [
        {
          value: 'Beijing',
          label: 'Beijinglabel'
        },
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Nanjing',
          label: 'Nanjing'
        },
        {
          value: 'Chengdu',
          label: 'Chengdu'
        },
        {
          value: 'Shenzhen',
          label: 'Shenzhen'
        },
        {
          value: 'Guangzhou',
          label: 'Guangzhou'
        }
      ],
      temp: {
        company_id: '',
        name: 'Test Client 1',
        parcel: [
          {
            country_of_destination: 'Tanzania',
            country_of_origin: 'China',
            parcel_type: 'Mixed',
            weight: 10
          },
          {
            country_of_destination: 'China',
            country_of_origin: 'Tanzania',
            parcel_type: 'Electronics',
            weight: 26.32
          },
          {
            country_of_destination: 'Uganda',
            country_of_origin: 'China',
            parcel_type: 'Mixed',
            weight: 50
          }
        ],
        phone_number: '657122924',
        phone_number_country_code: '255'
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Client name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        phone_number: [
          {
            required: true,
            message: 'Please input Client Phone number',
            trigger: 'blur'
          },
          { min: 9, message: 'Length should be at least 9', trigger: 'blur' }
        ],
        country_of_destination: [
          {
            required: true,
            message: 'Please select the destination',
            trigger: 'change'
          }
        ],
        country_of_origin: [
          {
            required: true,
            message: 'Please select country of origin',
            trigger: 'change'
          }
        ],
        weight: [
          {
            type: 'number',
            required: true,
            message: "Please add the client's cargo weight",
            trigger: 'change'
          }

        ],

        parcel_type: [
          {
            type: 'enum',
            enum: ['MIXED', 'CLOTHING', 'ELECTRONICS'],
            required: true,
            message: 'Please select a Parcel Type',
            trigger: 'change'
          },
          {
            required: true,
            message: 'Please select a Parcel Type',
            trigger: 'change'
          }
        ]
      },
      countryList: [],
      countryName: [],
      countryPhoneCode: []
    }
  },
  computed: {
    ...mapGetters('country', ['GetCountriesList'])
  },
  created() {
    console.log(this.cities)
    this.fetchCountries()
  },
  methods: {
    fetchCountries() {
      this.$store.dispatch('country/getCountries').then(() => {
        this.countryList = this.GetCountriesList
        console.log(this.countryList)
        this.countryPhoneCode = this.countryList.map(
          (a) => ` ${a.name} - ${a.phonecode}`
        )
        this.countryName = this.countryList.map((a) => a.name)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var ClientForm = {
            name: this.ruleForm.name,
            phone_number: this.ruleForm.phone_number,
            company_id: '1701566b-481b-4aa3-a1ae-b9c6eabf67c1',
            parcel: [
              {
                weight: this.ruleForm.weight,
                country_of_destination: this.ruleForm.country_of_destination,
                country_of_origin: this.ruleForm.country_of_origin,
                parcel_type: this.ruleForm.parcel_type
              }
            ]
          }
          this.$store.dispatch('client/ClientCreate', ClientForm)

          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style >
</style>
