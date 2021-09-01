const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String, index: true },
  category_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }]
})
// 定义虚拟字段
// schema.virtual('works', {
//   ref: 'Image',
//   localFiled: '_id',
//   foreignField: 'categories',
//   justOne: false // 返回字段是不是单条
// })
module.exports = mongoose.model('Theme', schema)
