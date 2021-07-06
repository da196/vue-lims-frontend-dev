<template>
  <el-form
    ref="role"
    :model="role"
    :rules="rules"
    label-width="140px"
    label-position="left"
  >
    <el-form-item label="Role Name" prop="name" required>
      <el-input v-model="role.name" />
    </el-form-item>

    <el-form-item label="Role Code" prop="code" required>
      <el-input v-model="role.code" />
    </el-form-item>
    <el-form-item label="Description" prop="description">
      <el-input v-model="role.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button
        plain
        size="mini"
        type="primary"
        @click="submitForm('role')"
      >Create
      </el-button>
      <el-button
        plain
        size="mini"
        @click="resetForm('role')"
      >Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Role name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: 'Please input Role Code',
            trigger: 'blur'
          },
          { min: 2, message: 'Length should be at least 3', trigger: 'blur' }
        ]
      },
      countryList: [],
      countryName: [],
      countryPhoneCode: []
    }
  },
  computed: {
    ...mapGetters('roles', ['getRoleResponseList'])
  },
  created() {
    // console.log(this.cities)
    // this.fetchCountries()
  },

  methods: {
    // fetchCountries() {
    //   this.$store.dispatch('country/getCountries').then(() => {
    //     this.countryList = this.GetCountriesList
    //     console.log(this.countryList)
    //     this.countryPhoneCode = this.countryList.map(
    //       (a) => ` ${a.name} - ${a.phonecode}`
    //     )
    //     this.countryName = this.countryList.map((a) => a.name)
    //   })
    // },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('roles/save', this.role).then(() => {
            this.closeDialog()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$emit('closeDialog', true)
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
</style>
