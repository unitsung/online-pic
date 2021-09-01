const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    select: false,
    // 给密码加密
    set(val) {
      return require('bcryptjs').hashSync(val, 10)
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  gender: {
    type: String,
    default: ''
  },
  birth: {
    type: String,
    default: ''
  },
  tel: {
    type: Number,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  }
})

// 导出Category模型，哪里需要用，哪里引入，引入到 routes/admin/index.js
module.exports = mongoose.model('User', schema)
