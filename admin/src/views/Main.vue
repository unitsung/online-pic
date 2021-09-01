<template>
  <el-container style="height: 100vh" class="main">
    <el-aside>
      <el-menu router :default-active="$route.path" unique-opened :default-opends="['1']">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span slot="title">管理菜单</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-data"></i>内容管理
          </template>
          <el-menu-item-group>
            <template slot="title">作品</template>
            <el-menu-item index="/images/create">新增作品</el-menu-item>
            <el-menu-item index="/images/list">作品列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">艺术家</template>
            <el-menu-item index="/artists/create">新增艺术家</el-menu-item>
            <el-menu-item index="/artists/list">艺术家列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-message"></i>运营管理
          </template>
          <el-menu-item-group>
            <template slot="title">文章</template>
            <el-menu-item index="/articles/create">新增文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">首页轮播图</template>
            <el-menu-item index="/banner/create">首页轮播图</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">分类</template>
            <el-menu-item index="/categories/create">新增作品分类</el-menu-item>
            <el-menu-item index="/categories/list">作品分类列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">题材</template>
            <el-menu-item index="/themes/create">新增主题</el-menu-item>
            <el-menu-item index="/themes/list">主题列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="3" v-if="userInfo.role=='admin'">
          <template slot="title">
            <i class="el-icon-s-tools"></i>系统管理
          </template>
          <el-menu-item-group>
            <template slot="title">用户管理</template>
            <el-menu-item index="/users/create">新增用户</el-menu-item>
            <el-menu-item index="/users/list">用户列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="r-menu">
          <el-avatar size="small" :src="userInfo.avatar" @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
          <el-dropdown>
            <i class="el-icon-guide" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="showInfo=true">修改信息</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog
      title="修改信息"
      :visible.sync="showInfo"
      width="30%"
      @close="showInfo=false"
      :close-on-click-modal="false"
    >
      <div class="infoEdit">
        <el-form label-width="120px" :model="model" :rules="rules" ref="Form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="model.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="model.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="role">
            <el-select v-model="model.role" disabled>
              <el-option
                v-for="(item,index) in roles"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="头像">
            <!-- upload用的是一个自带的ajax对象，action必须写完整的请求地址 -->
            <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload/avatar'"
              :show-file-list="false"
              :on-success="res=>model.avatar=res.url"
              :headers="getAuthHeader()"
            >
              <img v-if="model.avatar" :src="model.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio v-model="model.gender" label="男">男</el-radio>
            <el-radio v-model="model.gender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="model.birth"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="model.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="model.email"></el-input>
          </el-form-item>
          <el-form-item size="normal">
            <el-button type="primary" @click.native="save">保存</el-button>
            <el-button @click="showInfo=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
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
      id: '',
      userInfo: {
        username: '',
        role: '',
        avatar: ''
      },
      model: {
        username: '',
        password: '',
        avatar: '',
        tel: '',
        email: '',
        gender: '',
        role: '',
        birth: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ],
        role: [
          {
            required: true,
            message: '请选择用户类型',
            trigger: 'blur'
          }
        ],
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
      roles: [
        {
          name: '系统管理员',
          value: 'admin'
        },
        {
          name: '网站编辑',
          value: 'editor'
        },
        {
          name: '普通用户',
          value: 'user'
        }
      ]
    }
  },
  created() {
    this.userInfo.username = sessionStorage.getItem('username')
    this.userInfo.role = sessionStorage.getItem('role')
    this.userInfo.avatar = sessionStorage.getItem('avatar')
    this.id = sessionStorage.id
    this.fetch(this.id)
  },
  methods: {
    logOut() {
      localStorage.clear()
      sessionStorage.clear()
      this.$router.push('/')
      this.$message.success('账号注销成功！')
    },
    errorHandler() {},
    async fetch(id) {
      const res = await this.$http.get(`rest/users/${id}`)
      this.model = res.data
    },
    save() {
      this.$refs.Form.validate(async valid => {
        if (valid) {
          // eslint-disable-next-line no-unused-vars
          const res = await this.$http.put(`rest/users/${this.id}`, this.model)
          this.$router.push('/users/list')
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.main {
  .el-header {
    background-color: #bad8f5;
    color: #333;
    line-height: 60px;
    .r-menu {
      float: right;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin-right: 5px;
      }
    }
  }
  .el-menu-item {
    // background-color: #1f2d3d !important;
  }
  .el-aside {
    color: #333;
    background-color: #ddd;
    width: 200px !important;
  }
}
</style>
