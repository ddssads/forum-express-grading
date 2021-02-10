const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const commentController = require('../controllers/commentController')
const handleErrorAsync = func => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}
router.use(auth.authenticated)

router.post('/', handleErrorAsync(async (req, res, next) => {
  await commentController.postComment(req.user, req.body)
  return res.redirect(`/restaurants/${req.body.restaurantId}`)
}))


module.exports = router