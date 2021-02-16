const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const commentController = require('../controllers/commentController')
const handleErrorAsync = require('../_helpers').handleErrorAsync
router.use(auth.authenticated)

router.post('/', handleErrorAsync(async (req, res, next) => {
  await commentController.postComment(req.user, req.body)
  return res.redirect(`/restaurants/${req.body.restaurantId}`)
}))

router.delete('/:id', auth.authenticatedAdmin, handleErrorAsync(async (req, res, next) => {
  await commentController.deleteComment(req.params.id)
  return res.redirect(`/restaurants/${req.body.restaurantId}`)
}))

module.exports = router