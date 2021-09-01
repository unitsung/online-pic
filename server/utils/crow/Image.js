const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
  // mongoose.SchemaTypes.ObjectId: 表示数据库的ID
  // ref: 表示关联的模型
  name: { type: String },
  artist_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'Artist' },
  date: { type: String },
  cid: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
  theme_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'Theme' },
  bigImg: { type: String },
  smallImg: { type: String }
})

module.exports = mongoose.model('Image', schema)
