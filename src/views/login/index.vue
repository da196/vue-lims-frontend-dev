<template>
  <div class="login">
    <div class="app-download">
      <label id="first-title">ISO 9001:2015</label>
      <label id="second-title">CERTIFIED</label>
      <i class="bounce"><img :src="check" width="30px"></i>
    </div>
    <div class="login-container">
      <div class="login-content">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="off" label-position="left">
          <div class="title-wrap" style="text-align: -webkit-center;">
            <img
              class=" logo"
              alt="TCRA Logo"
              :src="logo"
            >
            <h3 class="title">
              Licensing Information Management System
            </h3>
          </div>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="loginForm.username" name="email" type="text" auto-complete="off" placeholder="Email Address" required />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.password"
              name="password"
              auto-complete="on"
              placeholder="password"
              :type="passwordType"
              required
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              Login
            </el-button>
          </el-form-item>
        </el-form>
        <p style="text-align: center">TCRA | All Rights Reserved &copy; {{ currentDate }} | Version: {{ currentVersion }}</p>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { setRefreshInterval } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      console.log(value)
      function validateUserRegex(val) {
        // const re = /([a-zA-Z1-9])+.([a-zA-Z1-9])+@tcra.go.tz/
        const re = /([a-zA-Z1-9.])+@tcra.go.tz/
        const re2 = /([a-zA-Z1-9.])+@mawasiliano.go.tz/
        return re.test(val) || re2.test(val)
      }

      if (!validateUserRegex(value)) {
        callback(new Error('Please enter your office email address'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      backgroundImage: require('@/assets/images/cell-tower-min.jpeg'),
      logo: require('@/assets/images/logo.png'),
      check: require('@/assets/images/check2.png'),
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', type: 'email', message: 'Please enter a valid email' },
          { required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters('app', [
      'session_expiry'
    ]),
    currentDate() {
      let va = new Date()
      va = va.getFullYear()
      return va
    },
    currentVersion() {
      return process.env.VUE_APP_VERSION || '1.0 Alpha'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    if (this.session_expiry) {
      this.$store.dispatch('app/toggleSessionExpiry', false)
      this.$message({
        message: 'The Session has expired, please login to continue',
        duration: 10 * 1000,
        type: 'warning'
      })
    }
  },
  methods: {

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs?.password?.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            setRefreshInterval()
            this.$router.push({ path: '/dashboard' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

$bg:#fefefe;
$light_gray:#2d3a4b;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0  0px 1000px rgba(0, 0, 0, 0.1) inset !important;
        -webkit-text-colorfill-color: rgba(0, 0, 0, 0.1) !important;
        color: rgba(0,0,0,0.1) !important;
        //-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        //-webkit-text-colorfill-color: #eee !important;
        //color: #eee !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

//$bg:#2d3a4b;
$bg:#fefefe;
$dark_gray:#889aa4;
$light_gray:rgb(7, 6, 6);
$bgColor: #054b5d;
$gradient-background: rgb(7,152,219);
$gr-background: #fefefe;
$brown: #B27C66;
$textColor:#eee;

.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  //background-color: $bgColor;
  //background: rgb(7,152,219);
  background: #fefefe;
  transition: background-color .3s ease-in-out;
  overflow: auto;

  /* badge */
  .app-download {
    display: flex;
    justify-content: space-around;
    align-items: center;
    direction: rtl;
    background-color: #0071f6;
    color: #fff;
    top: 0;
    position: fixed;
    flex-direction: column;
    z-index: 100;
    left: 2rem;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
    box-shadow: 1px 2px 14px 5px #00000070;
    padding: 1rem;

    &:focus {
      outline: none;
    }

    label {
      margin-top: .5rem;
      margin-bottom: .5rem;
      color: #fff;
      cursor: pointer;

      &#first-title {
        font-size: 1rem;
      }

      &#second-title {
        font-size: .8rem;
      }
    }
  }
    .login-container {
      background: $bg;
      //max-width: 1120px;
      min-height: 590px;
      //display: grid;
      grid-template-columns: auto 480px;
      transition: all .3s ease-in-out;
      transform: scale(1);

      .logo {
        display: block;
        width: 150px;
        height: 150px;
        margin-bottom: 20px;
        text-align: center;
      }

      .login-image {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        overflow: hidden;
        background-color: #303c4b;
        background-position: 50%;
        background-size: cover;
        opacity: 1;
        max-height: 667px;
        transition: opacity .3s ease-in-out, padding .2s ease-in-out;

        .photo-credit {
          justify-content: flex-end;
          align-self: flex-end;
          background-color: rgba(255, 255, 255, 0.8);
          margin: 10px;
          padding: 5px 8px;

          h4, span {
            margin: 0;
          }
        }
      }

      .login-form {
        min-width: 320px;
        padding: 130px 60px;
        position: relative;
        opacity: 1;
        transition: opacity .3s ease-in-out, padding .2s ease-in-out;
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-wrap {
        display: block;
        margin-bottom: 15px;
        text-align: center;

        .title {
          font-size: 24px;
          color: $light_gray;
          margin: 0px auto 10px auto;
          text-align: center;
          font-weight: bold;
        }

        .sub-heading {
          font-size: 14px;
          color: $light_gray;
          padding-bottom: 15px;
        }
      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .set-language {
        color: $textColor;
        position: absolute;
        top: 40px;
        right: 35px;
      }
    }
  }
</style>
