<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-row>
        <div class="el-descriptions">
          <div class="el-descriptions__header">
            <div>
              <h3 style="text-decoration: underline"> Form Details </h3>
            </div>
            <div class="el-descriptions__extra" />
          </div>
          <div class="el-descriptions__body">
            <table class="">
              <tbody>
                <tr>
                  <td colspan="2">
                    <span class="el-descriptions__label">Form Name:</span>
                    <span class="el-descriptions__content">{{ formName }}</span>
                  </td>
                  <td colspan="2">
                    <span class="el-descriptions__label">Form Code:</span>
                    <span class="el-descriptions__content">{{ formCode }}</span>
                  </td>
                  <td colspan="2">
                    <el-button
                      v-permission="['ROLE_LICENSE_FORM_ITEM_SAVE']"
                      plain
                      size="mini"
                      class="filter-item"
                      style="margin-left: 10px"
                      type="success"
                      icon="el-icon-circle-plus-outline"
                      @click="handleCreate"
                    >
                      Add Form Item
                    </el-button>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <span class="el-descriptions__label">Form Type:</span>
                    <span class="el-descriptions__content">{{ formType }}</span>
                  </td>
                  <td colspan="4">
                    <span class="el-descriptions__label">Form Description:</span>
                    <span class="el-descriptions__content"> {{ formDescription }} </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-row>
      <el-row style="margin-top: 20px">
        <h4 style="text-decoration: underline"> Form Details </h4>
        <el-table
          v-permission="['ROLE_LICENSE_FORM_ITEM_VIEW']"
          :data="list"
          row-key="id"
          border
          element-loading-text="Loading"
          fit
          size="mini"
          highlight-current-row
          :tree-props="{children: 'items', hasChildren: 'hasChildren'}"
        >
          <el-table-column label="Display Name" sortable>
            <span slot-scope="scope" style="word-break: break-word"> {{ scope.row.displayName }} </span>
          </el-table-column>
          <el-table-column label="Name" sortable>
            <span slot-scope="scope" style="word-break: break-word"> {{ scope.row.name }} </span>
          </el-table-column>
          <el-table-column prop="flag" label="Section Type" />
          <el-table-column align="center" width="200" label="Action">
            <template slot-scope="scope">
              <el-button
                v-permission="['ROLE_LICENSE_FORM_ACTIVATION_DEACTIVATION']"
                plain
                size="mini"
                type="danger"
                @click="() => append(scope.row)"
              >
                Deactivate
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-row>
      <el-row>
        <el-button
          plain
          size="mini"
          style="float: right; margin: 20px"
          type="primary"
          icon="el-icon-back"
          @click.prevent="$router.back()"
        >  Back</el-button>
      </el-row>

      <el-dialog :visible.sync="showLicenceFormItemDialog" :title="title" width="75%">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form
              ref="licenceFormItem"
              :model="licenceFormItem"
              :rules="licenceFormItemRules"
              label-width="140px"
              label-position="top"
            >
              <el-form-item label="Item Name" prop="name" required>
                <el-input v-model="licenceFormItem.name" />
              </el-form-item>
              <el-form-item label="Item Display Name" prop="displayName" required>
                <el-input v-model="licenceFormItem.displayName" />
              </el-form-item>
              <el-form-item label="Item Parent" prop="parent">
                <el-select v-model="licenceFormItem.parent" style="width:80%;" placeholder="Please select parent">
                  <el-option label="No Parent" :value="0" />
                  <el-option v-for="listParent in licenceFormParentList" :key="listParent.id" :label="listParent.name" :value="listParent.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="Item Feedback Type" prop="feedbackType" required>
                <el-select v-model="licenceFormItem.feedbackType" style="width: 80%" placeholder="Please select Feedback Type">
                  <el-option label="Fixed" value="FIXED" />
                  <el-option label="Dynamic" value="DYNAMIC" />
                  <el-option label="No Feedback" value="NONE" />
                </el-select>
              </el-form-item>
              <el-form-item label="Item Flag" prop="flag" required>
                <el-select v-model="licenceFormItem.flag" style="width: 80%" placeholder="Please select flag">
                  <el-option label="Section" value="SECTION" />
                  <el-option label="Sub Section" value="SUB_SECTION" />
                  <el-option label="Item" value="ITEM" />
                  <el-option label="Parameter" value="PARAMETER" />
                </el-select>
              </el-form-item>
              <template v-if="licenceFormItem.feedbackType === 'FIXED' && licenceFormItem.flag === 'PARAMETER' ">
                <el-form-item
                  v-for="(item, index) in licenceFormItem.options"
                  :key="item.key"
                  :label="'Option ' + index"
                  :prop="'options.' + index + '.value'"
                  :rules="{
                    required: true, message: 'Option can not be null', trigger: 'blur'
                  }"
                >

                  <el-col :span="11">
                    <el-input v-model="item.value" />
                  </el-col>
                  <el-col :span="2" />

                  <el-col :span="11">
                    <el-button
                      v-permission="['ROLE_LICENSE_FORM_ACTIVATION_DEACTIVATION']"
                      plain
                      size="mini"
                      type="danger"
                      style="margin-left: 20px"
                      @click.prevent="removeOption(item)"
                    >Delete</el-button>
                  </el-col>
                </el-form-item>
                <el-button
                  v-permission="['ROLE_LICENSE_FORM_SAVE']"
                  plain
                  size="mini"
                  type="primary"
                  style="margin: 20px"
                  @click.prevent="addDomain"
                > Add Option</el-button>
              </template>
            </el-form>

            <el-row>
              <el-button
                v-permission="['ROLE_LICENSE_FORM_SAVE']"
                plain
                size="mini"
                icon="el-icon-plus"
                type="primary"
                @click.prevent="addDataToBucket('licenceFormItem')"
              >
                Add Form Item
              </el-button>
              <el-button
                plain
                size="mini"
                icon="el-icon-minus"
                type="warning"
                @click="resetForm('licenceFormItem')"
              >Reset</el-button>
            </el-row>
          </el-col>
          <el-col :span="12">
            <h3 style="text-decoration: underline; text-align: center"> Form Items </h3>
            <el-table
              fit
              size="mini"
              :data="formItemBucket"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <p>Display Name: {{ props.row.displayName }}</p>
                  <p>Options: {{ props.row.options }}</p>
                  <p>Item FeedBack Type: {{ props.row.feedbackType }}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="Name"
                prop="name"
              />
              <el-table-column
                label="Parent"
                prop="parent"
              />
              <el-table-column label="Item Flag">
                <template slot-scope="scope">
                  {{ scope.row.flag }}
                </template>
              </el-table-column>
              <el-table-column label="Action" align="center">
                <template slot-scope="scope">
                  <el-button
                    plain
                    size="mini"
                    type="danger"
                    @click.prevent="deleteItemFromBucket(scope.row)"
                  > Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-button
            plain
            size="mini"
            type="primary"
            style="margin: 20px; float: right"
            @click.prevent="submitForm('licenceFormItem')"
          >Create
          </el-button>
        </el-row>

      </el-dialog>

    </div>
  </div>
</template>

<script>
import {
  createLicenceFormItem, getAllLicenceFormParents, getLicenceFormsItem
} from '@/api/configurations'
import { statusCodes } from '@/utils/status-codes'
// eslint-disable-next-line no-unused-vars
import { decodeHashId } from '@/utils'

export default {
  name: 'Index',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        status: undefined,
        sort: '+id'
      },
      search: '',
      title: 'Add Licence Form Item',
      list: [],
      filterText: '',
      listLoading: true,
      viewRolesLoading: false,
      editRolesLoading: false,
      showLicenceFormItemDialog: false,
      licenceFormItem: {
        id: 0,
        name: '',
        displayName: '',
        flag: '',
        feedbackType: '',
        parent: 0,
        options: []
      },
      licenceFormParentList: null,
      licenceFormItemRules: {
        name: [
          {
            required: true,
            message: 'Please input Licence Form Item name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        displayName: [
          {
            required: true,
            message: 'Please input Licence Form Item Display Name',
            trigger: 'blur'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'blur' }
        ],
        flag: [
          {
            required: true,
            message: 'Please select Licence Form Item Flag',
            trigger: 'blur'
          }
        ]
      },
      formId: 0,
      formName: '',
      formCode: '',
      formDescription: '',
      formType: '',
      defaultProps: {
        children: 'items',
        label: 'name'
      },
      id: 1000,
      formItemBucket: []
    }
  },
  created: function() {
    this.formId = decodeHashId(this.$route.params.parentId)[0]
    this.fetchData()
    this.getLicenceFormParentId()
  },
  methods: {
    removeOption(item) {
      var index = this.licenceFormItem.options.indexOf(item)
      if (index !== -1) {
        this.licenceFormItem.options.splice(index, 1)
      }
    },
    addDomain() {
      this.licenceFormItem.options.push({
        key: Date.now(),
        value: ''
      })
    },
    deleteItemFromBucket(data) {
      const index = this.formItemBucket.indexOf(data)
      if (index > -1) {
        this.formItemBucket.splice(index, 1)
      }
    },

    addDataToBucket(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.licenceFormItem.options.length > 0) {
            this.licenceFormItem.options = this.licenceFormItem.options.map(e => e.value)
          }
          this.licenceFormItem.id = 0
          let temp = this.licenceFormItem
          temp = JSON.parse(JSON.stringify(temp))
          this.formItemBucket.push(temp)
        } else {
          return false
        }
      })
      this.licenceFormItem.options = []
      this.$refs.licenceFormItem.resetFields()
      this.licenceFormItem.name = ''
      this.licenceFormItem.displayName = ''
      this.licenceFormItem.id = 0
    },
    append(data, node) {
      const newChild = { id: this.id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    getLicenceFormParentId() {
      this.listLoading = true
      getAllLicenceFormParents(this.formId).then(response => {
        this.licenceFormParentList = response.data
        this.listLoading = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.licenceFormParentList = []
        this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      getLicenceFormsItem(this.formId).then(response => {
        this.list = response.data.items
        this.formName = response.data.name
        this.formCode = response.data.code
        this.formDescription = response.data.description
        this.formType = response.data.formType
        this.listLoading = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.list = []
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.showLicenceFormItemDialog = false
      this.listLoading = true
      const formId = this.formId
      createLicenceFormItem(this.formItemBucket, formId).then(response => {
        if (response.code === statusCodes.SUCCESS) {
          this.$message({
            message: 'Licence Form Item created successfully.',
            showClose: true,
            type: 'success'
          })
          this.resetForm('licenceFormItem')
          this.fetchData()
          this.getLicenceFormParentId()
          this.clearDialog()
        }
      }).catch(() => {
        this.clearDialog()
        this.resetForm('licenceFormItem')
        this.$message({
          message: 'Sorry, Something went wrong.',
          showClose: true,
          type: 'error'
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName]?.resetFields()
    },
    clearDialog() {
      this.formItemBucket = []
      this.showLicenceFormItemDialog = false
      this.licenceFormItem = {
        id: 0,
        name: '',
        displayName: '',
        flag: '',
        feedbackType: '',
        parent: 0,
        options: []
      }
    },
    handleFilter() {
      console.log('handle filter')
    },
    handleCreate() {
      this.title = 'Add Licence Form Item'
      this.showLicenceFormItemDialog = true
      this.licenceFormItem = {
        id: 0,
        name: '',
        displayName: '',
        flag: '',
        feedbackType: '',
        parent: 0,
        options: []
      }
      this.resetForm('licenceFormItem')
    }
  }
}
</script>

<style scoped>

</style>
