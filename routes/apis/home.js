const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const passport = require('passport')
const auth = require('../../middleware/auth')
const handleErrorAsync = require('../../_helpers').handleErrorAsync

router.post('/signin', handleErrorAsync(async (req, res, next) => {
  const result = await userController.signIn(req.body, res)
  if (result.status === 'error') {
    return res.status(401).json(result)
  }
  return res.json(result)
}))

router.post('/signup', handleErrorAsync(async (req, res, next) => {
  if (req.body.passwordCheck !== req.body.password) {
    return res.json({ status: 'error', message: '兩次輸入密碼不相等' })
  }
  const user = await userController.checkUser(req.body.email)
  if (user) {
    return res.json({ status: 'error', message: '信箱重複' })
  } else {
    await userController.signUp(req.body.name, req.body.email, req.body.password)
    return res.json({ status: 'success', message: '註冊成功' })
  }
}))

module.exports = router