/* assert(value, [status], [message], [properties])
   测试 value 值是否为真。如果 value 值为假，
   一个带有给定 status、 message 和 properties 属性的 HttpError 实例会被抛出。
*/

module.exports = (options) => {
  const jwt = require('jsonwebtoken')
  const user = require('../models/User')
  //引入http-assert库处理错误
  const assert = require('http-assert')

  return async (req, res, next) => {
    const token = String(req.headers.authorization || '')
      .split(' ')
      .pop()
    assert(token, 401, '请先登录!')
    // 解密token 得到用户ID
    const { id } = jwt.verify(token, req.app.set('secret'))
    assert(id, 401, '请先登录!')
    // 验证数据库里的数据
    req.user = user.findById(id)
    assert(req.user, 401, '该用户不存在！请联系管理员！')
    await next()
  }
}
