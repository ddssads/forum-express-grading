const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const handleErrorAsync = require('../_helpers').handleErrorAsync
const userController = require('../controllers/userController')

router.use(auth.authenticated)

router.post('/:restaurantId', handleErrorAsync(async (req, res) => {
  await userController.addFavorite(req.user.id, req.params.restaurantId)
  return res.redirect('back')
}))

router.delete('/:restaurantId', handleErrorAsync(async (req, res) => {
  await userController.removeFavorite(req.user.id, req.params.restaurantId)
  return res.redirect('back')
}))

module.exports = router