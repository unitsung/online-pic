// 数据库插件 要求必须是个函数，接收一个参数app

// 数据库
module.exports = (app) => {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/online-pic', {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
}
