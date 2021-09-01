<template>
  <div class="about">
    <h1>{{ id ? '修改' : '新增' }}用户</h1>
    <el-form label-width="120px" :model="model" :rules="rules" ref="Form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="role">
        <el-select v-model="model.role" placeholder="请选择">
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
        <el-button @click="resetForm" v-if="!id">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
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
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/users/${id}`)
      this.model = res.data
    },
    save() {
      this.$refs.Form.validate(async valid => {
        if (valid) {
          // eslint-disable-next-line no-unused-vars
          let res
          if (this.id) {
            res = await this.$http.put(`rest/users/${this.id}`, this.model)
          } else {
            res = await this.$http.post('rest/users', this.model)
          }
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
    },
    resetForm() {
      // 通过表单的引用对象ref属性找到对应的表单Form
      this.$refs.Form.resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
.about {
  width: 500px;
  margin: 0 auto;
  h1 {
    margin: 0 auto;
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
}
</style>
