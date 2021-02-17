const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../../controllers/adminController')
const categoryController = require('../../controllers/categoryController')
const handleErrorAsync = require('../../_helpers').handleErrorAsync
const auth = require('../../middleware/auth')

router.use(auth.apiAuthenticated, auth.apiAuthenticatedAdmin)
//取得所有餐廳資訊
router.get('/restaurants', handleErrorAsync(async (req, res, next) => {
  const restaurants = await adminController.getRestaurants()
  res.json({ restaurants })
}))

//瀏覽單一餐廳資訊
router.get('/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await adminController.getRestaurant(req.params.id)
  res.json({ restaurant })
}))

//新增餐廳
router.post('/restaurants', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    return res.json({ status: 'error', message: 'name didn\'t exist' })
  }
  await adminController.postRestaurant(req.file, req.body)
  return res.json({ status: 'success', message: 'restaurant was successfully created' })
}))

//取得分類資訊
router.get('/categories', handleErrorAsync(async (req, res, next) => {
  const categories = await categoryController.getCategories()
  return res.json({ categories })
}))

//刪除餐廳
router.delete('/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  await adminController.deleteRestaurant(req.params.id)
  return res.json({ status: 'success', message: '' })
}))

//編輯餐廳資訊
router.put('/restaurants/:id', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    return res.json({ status: 'error', message: 'name didn\'t exist' })
  }
  await adminController.putRestaurant(req.file, req.body, req.params.id)
  return res.json({ status: 'success', message: 'restaurant was successfully to update' })
}))

//新增分類
router.post('/categories', handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    return res.json({ status: 'error', message: 'name didn\'t exist' })
  }
  await categoryController.postCategory(req.body)
  return res.json({ status: 'success', message: 'new category was created' })
}))
//編輯分類
router.put('/categories/:id', handleErrorAsync(async (req, res, next) => {
  const category = await categoryController.putCategory(req.params.id, req.body)
  return res.json({ status: 'success', message: 'category was successfully to update' })
}))
//刪除分類
router.delete('/categories/:id', handleErrorAsync(async (req, res, next) => {
  await categoryController.deleteCategory(req.params.id)
  return res.json({ status: 'success', message: 'category was successfully to delete' })
}))
//取得用戶資訊
router.get('/users', handleErrorAsync(async (req, res, next) => {
  const users = await adminController.getUsers()
  return res.json({ users })
}))

//修改用戶權限
router.put('/users/:id/toggleAdmin', handleErrorAsync(async (req, res, next) => {
  const user = await adminController.toggleAdmin(req.params.id)
  return res.json({ status: 'success', message: 'successfully to change' })
}))

module.exports = router