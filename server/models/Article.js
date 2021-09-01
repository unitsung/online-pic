const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String },
  detail: { type: String }
})

module.exports = mongoose.model('Article', schema)
