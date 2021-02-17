const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const commentController = require('../../controllers/commentController')
const handleErrorAsync = require('../../_helpers').handleErrorAsync
router.use(auth.apiAuthenticated)

router.post('/', handleErrorAsync(async (req, res, next) => {
  await commentController.postComment(req.user, req.body)
  return res.json({ status: 'success', message: '' })
}))

router.delete('/:id', auth.apiAuthenticatedAdmin, handleErrorAsync(async (req, res, next) => {
  await commentController.deleteComment(req.params.id)
  return res.json({ status: 'success', message: '' })
}))

module.exports = router