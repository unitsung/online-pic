const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  images_id: [{ type: mongoose.SchemaTypes.ObjectId }]
})

module.exports = mongoose.model('Banner', schema)
