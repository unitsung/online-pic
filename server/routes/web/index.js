/*  
    所有的接口都是相似的API接口  比如，/categories 去引用 Category模型 
    const Model = require(`../../models/${req.params.resource}`)
    eg.
    const item = await Category.find().populate('parent').limit(limit)
    把categories变为Category 安装依赖 inflection
    在app.use加一个中间件  req.Model 为了能让Model在下一个中间件使用，需要挂载到req上
*/
const jwt = require('jsonwebtoken')
const assert = require('http-assert')
const User = require('../../models/User')
const Artist = require('../../models/Artist')
const Category = require('../../models/Category')
const Theme = require('../../models/Theme')
const Image = require('../../models/Image')
const fs = require('fs')
const path = require('path')

module.exports = (app) => {
  const express = require('express')
  // express的子路由
  const router = express.Router({
    mergeParams: true //合并父级url参数到router
  })
  const resourceMiddleware = require('../../middleware/resource')()

  // 创建资源
  router.post('/', async (req, res) => {
    // 把数据存入数据库
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 资源列表
  router.get('/', async (req, res) => {
    const limit = +req.query.limit || 10
    const skip = +req.query.skip || 0
    const cid = req.query.cid || ''
    // populate('parent') 查询关联字段 返回一个包含关联字段信息的对象
    const queryOptions = {}
    if (req.Model.modelName === 'Theme') {
      const item = await req.Model.find(queryOptions).skip(skip).limit(limit)
      res.send(item)
      return
    }
    if (req.Model.modelName === 'Image') {
      queryOptions.cid = cid
      const item = await req.Model.find(queryOptions)
        .populate('artist_id')
        .populate('cid')
        .populate('theme_id')
        .skip(skip)
        .limit(limit)
      const count = await req.Model.find(queryOptions).count()
      res.send({ item, count })
      return
    }
    const item = await req.Model.find()
      .setOptions(queryOptions)
      .skip(skip)
      .limit(limit)
    const count = await req.Model.find(queryOptions).count()
    res.send({ item, count })
  })
  // 资源详情
  router.get('/:id', async (req, res) => {
    if (req.Model.modelName === 'Image') {
      const model = await req.Model.findById(req.params.id)
        .populate('artist_id')
        .populate('cid')
        .populate('theme_id')
      res.send(model)
      return
    }

    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 更新资源
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删除资源
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  // 把子路由挂载到app上
  app.use('/web/api/rest/:resource', resourceMiddleware, router)

  // 上传路由 由于express不能处理file 二进制必须安装依赖multer 作为中间件处理
  // upload.single 给req加上上传组件传来的file属性
  const multer = require('multer')
  let storage = multer.diskStorage({
    destination(req, file, cb) {
      // console.log(req.params)
      switch (req.params.type) {
        case 'avatar':
          cb(null, __dirname + '../../../uploads/avatar')
          break
        case 'big':
          cb(null, __dirname + '../../../uploads/big')
          break
        case 'small':
          cb(null, __dirname + '../../../uploads/small')
          break
        case 'article':
          cb(null, __dirname + '../../../uploads/article')
          break
        default:
          break
      }
    },
    filename(req, file, cb) {
      cb(null, `${file.originalname}`)
    }
  })

  const upload = multer({ storage: storage })
  app.post('/web/api/upload/:type', upload.single('file'), async (req, res) => {
    const file = req.file
    // 为了能让客户端访问图片
    file.url = `http://localhost:3000/uploads/${
      req.params.type + '/' + file.filename
    }`
    res.send(file)
  })

  //实现根据分类数据变化查询主题
  app.get('/web/api/themes', async (req, res) => {
    console.log(req.query.id)
    const model = await Theme.find({ category_id: req.query.id })
    // console.log(model)
    res.send(model)
  })

  app.get('/web/api/images/filter', async (req, res) => {
    const limit = +req.query.limit || 10
    const skip = +req.query.skip || 0
    const item = await Image.find({
      cid: req.query.cid,
      theme_id: req.query.tid
    })
      .skip(skip)
      .limit(limit)
    const count = await Image.find({
      cid: req.query.cid,
      theme_id: req.query.tid
    }).count()
    res.send({ item, count })
  })
  app.post('/web/api/images/search', async (req, res) => {
    const limit = +req.params.limit || 10
    const skip = +req.params.skip || 0
    const reg = new RegExp(req.body.name)
    console.log(reg)
    const item = await Image.find({
      $or: [{ name: { $regex: reg } }, { date: { $regex: reg } }]
    })
      .skip(skip)
      .limit(limit)
    const count = await Image.find({
      name: { $regex: reg }
    }).count()
    res.send({ item, count })
  })

  // 实现用户登录：

  app.post('/web/api/login', async (req, res) => {
    const { username, password } = req.body
    //  1.根据用户名找用户 res.status(422) 返回错误代码 查询password
    const user = await User.findOne({ username: username }).select('+password')

    assert(user, 422, '用户不存在！')

    //  2.校验密码
    const isValid = require('bcryptjs').compareSync(password, user.password)
    assert(isValid, 422, '密码错误！')
    //3.返回token sign(需要生成token的字段，密钥)
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    const { avatar, _id } = user
    res.send({ token, username, avatar, _id })
  })

  app.post('/web/api/register', async (req, res) => {
    const { username, password } = req.body
    //  1.根据用户名找用户 res.status(422) 返回错误代码
    const user = await User.findOne({ username: username })
    assert(!user, 422, '该用户名已被注册！请重新输入')
    console.log(req.body)
    const register = await User.create(req.body)
    assert(register, 422, '注册失败！请稍后再试')
    res.send({ code: 1, msg: '用户注册成功!' })
  })
  //修改密码api
  app.put('/web/api/pass/:id', async (req, res) => {
    const { username, password, newpass } = req.body
    const user = await User.findOne({ username: username }).select('+password')
    //  2.校验密码
    const isValid = require('bcryptjs').compareSync(password, user.password)
    assert(isValid, 422, '原密码错误！')
    const model = await User.findByIdAndUpdate(id, { password: newpass })
    res.send(model)
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}
