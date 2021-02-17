const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const handleErrorAsync = require('../../_helpers').handleErrorAsync
const userController = require('../../controllers/userController')
const helpers = require('../../_helpers')

router.use(auth.apiAuthenticated)
router.post('/:id', handleErrorAsync(async (req, res, next) => {
  await userController.addFollowing(helpers.getUser(req).id, req.params.id)
  return res.json({ status: 'success', message: '' })
}))
router.delete('/:id', handleErrorAsync(async (req, res, next) => {
  await userController.removeFollowing(helpers.getUser(req).id, req.params.id)
  return res.json({ status: 'success', message: '' })
}))
module.exports = router