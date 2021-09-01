const mongoose = require('mongoose')
// 定义模型字段
const schema = new mongoose.Schema({
  name: { type: String },
  info: { type: String, trim: true, default: '不详' }
})

module.exports = mongoose.model('Artist', schema)
