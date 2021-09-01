const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
  name: { type: String, index: true }
})
// 定义虚拟字段
// schema.virtual('works', {
//   ref: 'Image',
//   localFiled: '_id',
//   foreignField: 'categories',
//   justOne: false // 返回字段是不是单条
// })

module.exports = mongoose.model('Category', schema)
