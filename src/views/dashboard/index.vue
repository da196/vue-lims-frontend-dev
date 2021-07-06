<template>
  <div class="dashboard-container">
    <el-row>
      <el-card>
        <el-row>
          <el-col :md="14" :sm="14">
            <el-row>
              <p style="font-size: 1.5rem">Hello <b>{{ name }}</b></p>
            </el-row>
            <el-row>
              <b>Licencing Officer</b>
              <el-divider direction="vertical" />
              <b>TCRA</b>
            </el-row>
          </el-col>
          <el-col :md="4" :sm="4" class="centered-text">
            <span style="padding-top: 5px"><b>Tasks Assigned</b> <br> <span style="font-size: xx-large; color: #f89e16">{{ activeTasks }}</span> </span>
          </el-col>
          <el-col :md="2" :sm="2" style="text-align: center">
            <el-divider direction="vertical" class="custom-divider" />
          </el-col>
          <el-col :md="4" :sm="4" class="centered-text" style="text-align: start !important;">
            <span><b>Tasks Completed</b> <br> <span style="font-size: xx-large;color: #34bfa3">0 </span> </span>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row style="margin-top: 1rem" :gutter="30">
      <el-col :md="24" :sm="24">
        <el-card>
          <div class="filter-container">
            <h4 style="text-align: center">Recent Activities</h4>
            <el-input v-model="listQuery.title" size="mini" placeholder="Search" style="width: 200px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.status" size="mini" placeholder="Task Status" clearable style="width: 200px;margin-right: 20px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in taskOptions" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
            <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Search
            </el-button>
            <el-button v-if="listQuery.showClear" size="mini" class="filter-item" type="info" icon="el-icon-minus" @click="handleClearQuery">
              Clear
            </el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="list"
            size="mini"
            element-loading-text="Loading"
            fit
            highlight-current-row
          >
            <el-table-column label="#" align="center" width="50">
              <template slot-scope="scope">
                {{ page.number !== 0 ? Math.abs((page.number - 1) * page.size + scope.$index + 1) : ( scope.$index + 1) }}
              </template>
            </el-table-column>
            <el-table-column label="Activity Name">
              <template slot-scope="scope">
                {{ scope.row.taskName | defaultNull }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="Date Created">
              <template slot-scope="scope">
                <span>{{ scope.row.createdAt }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="dueDate" label="Due Date">
              <template slot-scope="scope">
                <span>{{ scope.row.dueDate | defaultNull }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Actions" align="center" class-name="small-padding fixed-width" width="150">
              <template slot-scope="{row}">
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="handleView(row)"
                >
                  Manage
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="page.totalElements"
            :page.sync="page.number"
            :limit.sync="page.size"
            @pagination="getNextData"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { encodeHashId } from '@/utils'
import { getMyTasks } from '@/api/tasks'
import pagination from '@/components/Pagination'
import { defaultNull } from '@/filters'

export default {
  name: 'Dashboard',
  components: {
    pagination
  },
  filters: {
    defaultNull
  },
  data() {
    return {
      listLoading: false,
      activeTasks: 0,
      list: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: '',
        type: undefined,
        status: undefined,
        sort: '+id',
        showClear: false

      },
      page: {
        size: 10,
        totalElements: 0,
        totalPages: 1,
        number: 0
      },
      newPage: true,
      taskOptions: [
        { key: 'NEW', value: 'New' },
        { key: 'IN_PROGRESS', value: 'In-Progress' },
        { key: 'COMPLETED', value: 'Completed' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    IndexNumber(scope) {
      return this.page.number !== 0 ? Math.abs((this.page.number - 1) * this.page.size + scope.$index + 1) : (scope.$index + 1)
    },
    getNextData() {
      if (this.page.number > 0) {
        this.page.number = this.page.number - 1
      }
      this.fetchData()
      this.page.number += 1
    },
    filterPageData(pageResponse) {
      if (this.newPage) {
        this.page = pageResponse
        this.newPage = false
      } else {
        this.page.totalElements = pageResponse.totalElements
        this.page.size = pageResponse.size
        this.page.number = pageResponse.number += 1
      }
    },
    fetchData() {
      this.listLoading = true
      getMyTasks(this.page.number, this.page.size, this.listQuery.title).then(response => {
        this.listLoading = false
        if (response.data) {
          this.list = response.data.content
          this.filterPageData(response.data.page)
        } else {
          this.list = []
          this.$message({
            message: 'No tasks available',
            showClose: true,
            type: 'success'
          })
        }
        this.activeTasks = this.page.totalElements
      }).catch(e => {
      })
    },

    handleView(data) {
      const hashed_id = encodeHashId(data.id)
      const applicationId = encodeHashId(data.trackableId)
      this.$router.push({ name: 'MyDetails',
        params: { applicationId: applicationId, selectedLicenceType: data.trackableType ?? 'ENTITY', taskHash: hashed_id }})
    },
    handleFilter() {
      this.listQuery.showClear = true
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
    },
    handleClearQuery() {
      this.listQuery.showClear = false
      this.listQuery.title = ''
      this.page.number = 0
      this.page.size = 10
      this.fetchData()
    }
  }

}
</script>

<style lang="scss" scoped>

.particle {
  position: absolute;
  border-radius: 50%;
}

@for $i from 1 through 30 {
  @keyframes particle-animation-#{$i} {
    100% {
      transform: translate3d((random(90) * 1vw), (random(90) * 1vh), (random(100) * 1px));
    }
  }

  .particle:nth-child(#{$i}){
    animation: particle-animation-#{$i} 60s infinite;
    $size: random(5) + 5 + px;
    opacity: random(100)/100;
    height: $size;
    width: $size;
    animation-delay: -$i * .2s;
    transform: translate3d((random(90) * 1vw), (random(90) * 1vh), (random(100) * 1px));
    background: hsl(random(360), 70%, 50%);
  }
}

.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 1.5rem;
    //position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 2.2rem;
    }

    .font-size-big {
      float: left;
      font-size: 2.2rem;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 1rem;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 1.2rem;
      }
    }
  }
}

.custom-divider{
  height: 4em !important;
}
.centered-text {
  text-align: end;
  padding-top: 1em;
}
</style>
