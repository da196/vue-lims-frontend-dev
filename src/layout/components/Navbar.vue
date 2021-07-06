<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--          <el-avatar icon="el-icon-user-solid" class="user-avatar" />-->

          <avatar :name="name" class="user-avatar" />
          <div />
          <!--          <img :src="'https://robohash.org/set_set3/bgset_bg1/' + name +'?size=80x80'" class="user-avatar">-->
          <!--          <i class="el-icon-caret-bottom" style="line-height: 40px; top: unset" />-->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <span class="custom-name-tag">
            Signed in as <b>{{ name }} </b>
          </span>
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <router-link to="/tasks/my-tasks">
            <el-dropdown-item>My Tasks</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--    <div class="right-menu-item">-->
    <!--      <el-dropdown style="margin-right: 40px" trigger="click">-->
    <!--        <el-badge :value="200" :max="99" style="line-height: 25px;" class="item hover-effect notification-hover">-->
    <!--          <span class="el-dropdown-link ">-->
    <!--            Notifications-->
    <!--            <i class="el-icon-caret-bottom" />-->
    <!--          </span>-->
    <!--        </el-badge>-->
    <!--        <template #dropdown>-->
    <!--          <el-dropdown-menu>-->
    <!--            <el-dropdown-item>Action 1</el-dropdown-item>-->
    <!--            <el-dropdown-item>Action 2</el-dropdown-item>-->
    <!--            <el-dropdown-item>Action 3</el-dropdown-item>-->
    <!--            <el-dropdown-item disabled>Action 4</el-dropdown-item>-->
    <!--            <el-dropdown-item divided>Action 5</el-dropdown-item>-->
    <!--          </el-dropdown-menu>-->
    <!--        </template>-->
    <!--      </el-dropdown>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import avatar from '@/components/Avatar'

export default {
  components: {
    avatar,
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-name-tag{
  //ist-style: none;
  line-height: 36px;
  padding-left:20px;
  padding-right: 10px;
  //margin: 0;
  font-size: 14px;
  color: #606266;
  //cursor: pointer;
  //outline: 0;
}

.notification-hover {
  &:focus {
    outline: none;
  }
  &.hover-effect {
    cursor: pointer;
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
}
.right-menu-item {
  display: inline-block;
  //font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  float: right;
  .icon{
    font-size: 2rem;
    color: #409EFF;
  }
  .notifications{
    line-height: 50px;
    margin-left: 8px;
    font-weight: bold;
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px !important;
          height: 40px !important;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
