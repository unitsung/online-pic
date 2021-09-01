<template>
  <div class="login">
    <div class="logo"></div>
    <div class="login-form">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <h2 class="title">账号登录</h2>
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            prefix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            prefix-icon="el-icon-key"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
            show-password
          />
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; "
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <p>
          <!-- <el-link :underline="false" @click.native="$router.push('/forget')">忘记密码</el-link> -->
          <el-link :underline="false" @click.native="$router.push('/register')">还没有账号？去注册</el-link>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名!'))
      } else {
        if (!/^[a-z0-9\u4e00-\u9fa5]+$/gim.test(value)) {
          callback(
            new Error('用户名称不能包含特殊字符(只能包含数字、字母、中文)!')
          )
        }
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码!'))
      }
      if (value.length < 4) {
        callback(new Error('密码不少于4位！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password'
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.login()
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async login() {
      const res = await this.$http.post('/login', this.loginForm)
      localStorage.token = res.data.token
      sessionStorage.setItem('username', res.data.username)
      sessionStorage.setItem('id', res.data._id)
      this.$router.push('/main')
      this.$message({
        type: 'success',
        message: `登陆成功,欢迎你 "${res.data.username}"!`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: url('../assets/login-bg.jpg') center/cover;
  font-size: 14px;
  overflow: hidden;
}
.login-form {
  width: 400px;
  height: 300px;
  background-color: rgba($color: #fff, $alpha: 0.6);
  margin: 200px auto;
  box-sizing: border-box;
  h2 {
    font-weight: 600;
    color: #252a34;
  }
  .el-form {
    padding: 15px 30px;
  }
  .el-link:nth-of-type(1) {
    margin-right: 20px;
  }
  .el-link:hover {
    color: #f6416c;
  }
  .el-button {
    background-color: #00adb5;
    border-color: transparent;
  }
}
p {
  float: right;
}

.logo {
  width: 200px;
  height: 65px;
  margin: 20px 0 0 20px;
  background: url('../assets/login-logo.svg') no-repeat;
  background-size: 100% 100%;
  cursor: po;
}
</style>
