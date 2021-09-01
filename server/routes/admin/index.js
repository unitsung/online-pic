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
const fs = require('fs')
const path = require('path')

module.exports = (app) => {
  const express = require('express')
  // express的子路由
  const router = express.Router({
    mergeParams: true //合并父级url参数到router
  })
  const authMiddleware = require('../../middleware/auth')()
  const resourceMiddleware = require('../../middleware/resource')()

  // 创建资源
  router.post('/', async (req, res) => {
    // 把数据存入数据库
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 资源列表 校验是否登录
  router.get('/', authMiddleware, async (req, res) => {
    const limit = +req.query.limit || 10
    const skip = +req.query.skip || 0
    // populate('parent') 查询关联字段 返回一个包含关联字段信息的对象
    const queryOptions = {}
    if (req.Model.modelName === 'Theme') {
      const item = await req.Model.find(queryOptions)
        .populate('category_id')
        .skip(skip)
        .limit(limit)
      const count = await req.Model.find(queryOptions).count()
      res.send({ item, count })
      return
    }
    if (req.Model.modelName === 'Image') {
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

  // // 删除图片路由
  // router.delete('/deleteImg/:id', async (req, res) => {
  //   const filepath = req.params.bigImg
  //   fs.unlink(filepath, () => {
  //     res.send({ success: true })
  //   })
  // })
  // 把子路由挂载到app上
  app.use(
    '/admin/api/rest/:resource',
    authMiddleware,
    resourceMiddleware,
    router
  )

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
  app.post(
    '/admin/api/upload/:type',
    authMiddleware,
    upload.single('file'),
    async (req, res) => {
      const file = req.file
      // 为了能让客户端访问图片
      file.url = `http://localhost:3000/uploads/${
        req.params.type + '/' + file.filename
      }`
      res.send(file)
    }
  )

  //实现根据分类数据变化查询主题
  app.get('/admin/api/themes', authMiddleware, async (req, res) => {
    console.log(req.query.id)
    const model = await Theme.find({ category_id: req.query.id })
    // console.log(model)
    res.send(model)
  })

  // 实现用户登录：

  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    //  1.根据用户名找用户 res.status(422) 返回错误代码 查询password
    const user = await User.findOne({ username: username }).select('+password')

    assert(user, 422, '用户不存在！')
    const hasRight = await User.findOne({
      username: username,
      $or: [{ role: 'admin' }, { role: 'editor' }]
    })
    assert(hasRight, 422, '对不起，您没有权限访问该系统！')
    //  2.校验密码
    const isValid = require('bcryptjs').compareSync(password, user.password)
    assert(isValid, 422, '密码错误！')
    //3.返回token sign(需要生成token的字段，密钥)
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    const { role, avatar, _id } = user
    res.send({ token, username, role, avatar, _id })
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}
