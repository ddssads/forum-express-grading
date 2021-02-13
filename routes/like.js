const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const handleErrorAsync = require('../_helpers').handleErrorAsync
const userController = require('../controllers/userController')

router.use(auth.authenticated)

router.post('/:restaurantId', handleErrorAsync(async (req, res, next) => {
  await userController.addLike(req.user.id, req.params.restaurantId)
  console.log(req.user)
  return res.redirect('back')
}))

router.delete('/:restaurantId', handleErrorAsync(async (req, res, next) => {
  await userController.removeLike(req.user.id, req.params.restaurantId)
  return res.redirect('back')
}))

module.exports = router