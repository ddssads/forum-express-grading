const express = require('express')
const router = express.Router()
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