<template>
  <div id="navbar">
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      background-color="#f6f6f6"
      text-color="#333"
      active-text-color="#f06868"
      router
      class="nav"
    >
      <div class="wrapper">
        <div class="item">
          <el-menu-item index="/main">首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title">发现</template>
            <el-menu-item index="/cate/youhua">油画</el-menu-item>
            <el-menu-item index="/cate/shuimo">当代水墨</el-menu-item>
            <el-menu-item index="/cate/banhua">版画</el-menu-item>
            <el-menu-item index="/cate/guohua">国画</el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="/artist">艺术家</el-menu-item> -->
          <el-menu-item index="/news">新闻头条</el-menu-item>
        </div>
        <div class="r-menu">
          <el-tooltip content="上传作品" placement="top" effect="dark">
            <div class="upload" @click="handleClick"></div>
          </el-tooltip>
          <div class="info" v-if="token">
            <el-dropdown>
              <el-avatar size="small" :src="userInfo.avatar">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showInfo=true">修改信息</el-dropdown-item>
                <el-dropdown-item @click.native="changePass=true">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="login" v-else>
            <a href="javascript:;" @click="$router.push('/login')">登录</a>
            <a href="javascript:;" @click="$router.push('/register')">注册</a>
          </div>
        </div>
      </div>
    </el-menu>
    <el-dialog
      title="修改个人信息"
      :visible.sync="showInfo"
      @close="showInfo=false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="infoEdit">
        <el-form label-width="120px" :model="userInfo" :rules="rules" ref="Form">
          <el-form-item label="头像">
            <!-- upload用的是一个自带的ajax对象，action必须写完整的请求地址 -->
            <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload/avatar'"
              :show-file-list="false"
              :on-success="res=>userInfo.avatar=res.url"
            >
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio v-model="userInfo.gender" label="男">男</el-radio>
            <el-radio v-model="userInfo.gender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="userInfo.birth"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="userInfo.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item size="normal">
            <el-button type="primary" @click.native="save" plain>保存</el-button>
            <el-button @click="showInfo=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="changePass"
      @close=" changePass=false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="passEdit">
        <el-form label-width="120px" :model="userPass" :rules="passRule" ref="passForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userPass.username"></el-input>
          </el-form-item>
          <el-form-item label="原密码" prop="password">
            <el-input v-model="userPass.password" placeholder="请输入原密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
            <el-input v-model="userPass.newpass" placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
          <el-form-item size="normal">
            <el-button type="primary" @click.native="changePwd" plain>保存</el-button>
            <el-button @click="changePass=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value == '') {
        callback()
      } else {
        if (!/1[3-9][0-9]{9}/.test(value)) {
          callback(new Error('请输入正确的联系电话'))
        }
        callback()
      }
    }
    return {
      showInfo: false,
      changePass: false,
      token: '',
      uid: '',
      userInfo: {
        avatar: '',
        tel: '',
        email: '',
        gender: '',
        birth: ''
      },
      userPass: {
        username: '',
        password: '',
        newpass: ''
      },
      rules: {
        tel: [
          {
            max: 11,
            validator: validatePhone,
            message: '请输入正确的电话',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      passRule: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ],
        newpass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.token = localStorage.token
    this.uid = sessionStorage.id
    this.uid && this.fetch(this.uid)
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/users/${id}`)
      this.userInfo = res.data
    },
    logOut() {
      localStorage.clear()
      sessionStorage.clear()
      this.token = ''
      if (this.$route.fullPath !== '/main') this.$router.push('/main')
      this.$message.success('账号注销成功！')
    },
    save() {
      this.$refs.Form.validate(async (valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-vars
          const res = await this.$http.put(
            `rest/users/${this.uid}`,
            this.userInfo
          )
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.fetch(this.uid)
          this.showInfo = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changePwd() {
      this.$refs.passForm.validate(async (valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-vars
          const res = await this.$http.put(`/pass/${this.uid}`, this.userPass)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.changePass = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClick() {
      if (this.token) {
        this.$router.push('/upload')
      } else {
        this.$message.error('请先登录!')
      }
    }
  }
}
</script>

<style lang='scss'>
#navbar {
  .nav {
    display: flex;
    justify-content: flex-start;
    .wrapper {
      display: flex;
      justify-content: space-between;
      .item {
        display: flex;
        justify-content: flex-start;
      }
      width: 1200px;
      margin: 0 auto;
      .el-submenu__icon-arrow {
        right: 5px;
        margin-top: -6px;
      }
    }
    .r-menu {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    a {
      font-size: 14px;
      color: #333;
      margin-right: 15px;
      text-decoration: none;
      &:hover {
        color: #f06868;
      }
    }
    .upload {
      width: 30px;
      height: 30px;
      background-color: #333;
      margin-right: 20px;
      background: url('../assets/nav-upload.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
  .el-dialog {
    background-color: #f5f5f5;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  // .el-button {
  //   background-color: #0dceda;
  // }
}
</style>
