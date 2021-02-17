const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const handleErrorAsync = require('../../_helpers').handleErrorAsync
const userController = require('../../controllers/userController')
const helpers = require('../../_helpers')

router.use(auth.apiAuthenticated)

//top使用者
router.get('/top', handleErrorAsync(async (req, res, next) => {
  const users = await userController.getTopUser(helpers.getUser(req))
  return res.json({ users })
}))

//取得單一使用者資料
router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const user = await userController.getUser(req.params.id)
  const { totalFavoritedRestaurants, totalFollowings, totalFollowers } = await userController.getUserTotalData(user)
  const { result, totalComments } = await userController.getUserComment(req.params.id)
  return res.json({ user, userComments: result, totalComments, totalFavoritedRestaurants, totalFollowings, totalFollowers })
}))

//編輯使用者頁面
router.get('/:id/edit', handleErrorAsync(async (req, res, next) => {
  const user = await userController.getUser(req.params.id)
  return res.json({ user })
}))

//修改使用者資料
router.put('/:id', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    return res.json({ status: 'error', message: 'name didn\'t exist' })
  }
  await userController.putUser(req.file, req.body, req.params.id)
  return res.json({ status: 'success', message: 'user was successfully to update' })
}))

module.exports = router
