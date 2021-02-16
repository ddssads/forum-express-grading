const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const auth = require('../middleware/auth')
const { route } = require('./home')
const handleErrorAsync = require('../_helpers').handleErrorAsync
//進入admin入由前須先驗證
router.use(auth.authenticatedAdmin)


router.get('/', (req, res) => res.redirect('/admin/restaurants'))

//瀏覽所有餐廳
router.get('/restaurants', handleErrorAsync(async (req, res, next) => {
  const restaurants = await adminController.getRestaurants()
  res.render('admin/restaurants', { restaurants })
}))

//新增餐廳頁面
router.get('/restaurants/create', async (req, res) => {
  const categories = await categoryController.getCategories()
  return res.render('admin/create', { categories })
})

//新增餐廳
router.post('/restaurants', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }
  await adminController.postRestaurant(req.file, req.body)
  req.flash('success_messages', 'restaurant was successfully created')
  return res.redirect('/admin/restaurants')
}))

//瀏覽單一餐廳資訊
router.get('/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await adminController.getRestaurant(req.params.id)
  res.render('admin/restaurant', { restaurant })
}))

//編輯餐廳資訊頁面
router.get('/restaurants/:id/edit', handleErrorAsync(async (req, res, next) => {
  const restaurant = await adminController.getRestaurant(req.params.id)
  const categories = await categoryController.getCategories()
  return res.render('admin/create', { restaurant, categories })
}))

//編輯餐廳資訊
router.put('/restaurants/:id', upload.single('image'), handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }
  await adminController.putRestaurant(req.file, req.body, req.params.id)
  req.flash('success_messages', 'restaurant was successfully to update')
  return res.redirect('/admin/restaurants')

}))

//刪除餐廳
router.delete('/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  await adminController.deleteRestaurant(req.params.id)
  return res.redirect('/admin/restaurants')
}))

//顯示所有用戶頁面
router.get('/users', handleErrorAsync(async (req, res, next) => {
  const users = await adminController.getUsers()
  return res.render('admin/users', { users })
}))

//修改用戶權限
router.put('/users/:id/toggleAdmin', handleErrorAsync(async (req, res, next) => {
  const user = await adminController.toggleAdmin(req.params.id)
  req.flash('success_messages', `${user.name} was successfully to change`)
  return res.redirect('/admin/users')
}))

//顯示分類頁面
router.get('/categories', handleErrorAsync(async (req, res, next) => {
  const categories = await categoryController.getCategories()
  return res.render('admin/categories', { categories })
}))
//新增分類
router.post('/categories', handleErrorAsync(async (req, res, next) => {
  if (!req.body.name) {
    req.flash('error_messages', 'name didn\'t exist')
    return res.redirect('back')
  }
  await categoryController.postCategory(req.body)
  return res.redirect('/admin/categories')
}))
//單一分類頁面
router.get('/categories/:id', handleErrorAsync(async (req, res, next) => {
  const { categories, category } = await categoryController.getCategories(req.params.id)
  return res.render('admin/categories', { categories, category })
}))
//編輯單一分類
router.put('/categories/:id', handleErrorAsync(async (req, res, next) => {
  const category = await categoryController.putCategory(req.params.id, req.body)
  return res.redirect('/admin/categories')
}))
//刪除分類
router.delete('/categories/:id', handleErrorAsync(async (req, res, next) => {
  await categoryController.deleteCategory(req.params.id)
  return res.redirect('/admin/categories')
}))
module.exports = router