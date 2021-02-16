const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const handleErrorAsync = require('../_helpers').handleErrorAsync
const userController = require('../controllers/userController')
const helpers = require('../_helpers')

router.use(auth.authenticated)

router.get('/top', handleErrorAsync(async (req, res, next) => {
  const users = await userController.getTopUser(helpers.getUser(req))
  return res.render('topUser', { users })
}))

router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const user = await userController.getUser(req.params.id)
  const { totalFavoritedRestaurants, totalFollowings, totalFollowers } = await userController.getUserTotalData(user)
  const { result, totalComments } = await userController.getUserComment(req.params.id)
  return res.render('admin/user', { user, userComments: result, totalComments, totalFavoritedRestaurants, totalFollowings, totalFollowers })
}))

router.get('/:id/edit', handleErrorAsync(async (req, res, next) => {
  const user = await userController.getUser(req.params.id)
  return res.render('admin/useredit', { user })
}))

router.put('/:id', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }
  await userController.putUser(req.file, req.body, req.params.id)
  req.flash('success_messages', 'user was successfully to update')
  return res.redirect(`/users/${req.user.id}`)
}))


module.exports = router
