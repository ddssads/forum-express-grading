const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const handleErrorAsync = func => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}
const userController = require('../controllers/userController')

router.use(auth.authenticated)

router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const user = await userController.getUser(req.params.id)
  const { userComments, totalComments } = await userController.getUserComment(req.params.id)
  console.log('@@@', totalComments)
  return res.render('admin/user', { user, userComments, totalComments })
}))

router.get('/:id/edit', handleErrorAsync(async (req, res, next) => {
  const user = await userController.getUser(req.params.id)
  return res.render('admin/useredit', { user })
}))

router.put('/:id', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  console.log(req.body)
  if (!req.body.name) {
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }
  await userController.putUser(req.file, req.body, req.params.id)
  req.flash('success_messages', 'user was successfully to update')
  return res.redirect(`/users/${req.user.id}`)
}))

module.exports = router
