const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const passport = require('passport')
const auth = require('../../middleware/auth')
const handleErrorAsync = require('../../_helpers').handleErrorAsync

router.post('/signin', handleErrorAsync(async (req, res, next) => {
  await userController.signIn(req.body, res)
}))

module.exports = router