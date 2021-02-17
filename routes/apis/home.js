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

module.exports = router