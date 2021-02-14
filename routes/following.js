const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const handleErrorAsync = require('../_helpers').handleErrorAsync
const userController = require('../controllers/userController')
const helpers = require('../_helpers')

router.use(auth.authenticated)
router.post('/:id', handleErrorAsync(async (req, res, next) => {
  await userController.addFollowing(helpers.getUser(req).id, req.params.id)
  return res.redirect('back')
}))
router.delete('/:id', handleErrorAsync(async (req, res, next) => {
  await userController.removeFollowing(helpers.getUser(req).id, req.params.id)
  return res.redirect('back')
}))
module.exports = router