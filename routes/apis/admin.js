const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../../controllers/adminController')
const categoryController = require('../../controllers/categoryController')
const handleErrorAsync = require('../../_helpers').handleErrorAsync



router.get('/admin/restaurants', handleErrorAsync(async (req, res, next) => {
  const restaurants = await adminController.getRestaurants()
  res.json({ restaurants })
}))

//瀏覽單一餐廳資訊
router.get('/admin/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await adminController.getRestaurant(req.params.id)
  res.json({ restaurant })
}))

//新增餐廳
router.post('/admin/restaurants', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    return res.json({ status: 'error', message: 'name didn\'t exist' })
  }
  await adminController.postRestaurant(req.file, req.body)
  return res.json({ status: 'success', message: 'restaurant was successfully created' })
}))

//顯示分類頁面
router.get('/admin/categories', handleErrorAsync(async (req, res, next) => {
  const categories = await categoryController.getCategories()
  return res.json({ categories })
}))

router.delete('/admin/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  await adminController.deleteRestaurant(req.params.id)
  return res.json({ status: 'success', message: '' })
}))
module.exports = router