const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const auth = require('../middleware/auth')
//進入admin入由前須先驗證
router.use(auth.authenticatedAdmin)


router.get('/', (req, res) => res.redirect('/admin/restaurants'))

//瀏覽所有餐廳
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await adminController.getRestaurants()
    res.render('admin/restaurants', { restaurants })
  } catch (e) {
    console.log(e)
  }
})

//新增餐廳頁面
router.get('/restaurants/create', (req, res) => {
  return res.render('admin/create')
})

//新增餐廳
router.post('/restaurants', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    await adminController.postRestaurant(req.file, req.body)
    setTimeout(() => {
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    }, 3000)
  } catch (e) {
    console.log(e)
  }
})

//瀏覽單一餐廳資訊
router.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await adminController.getRestaurant(req.params.id)
    res.render('admin/restaurant', { restaurant })
  } catch (e) {
    return console.log(e)
  }

})
//編輯餐廳資訊頁面
router.get('/restaurants/:id/edit', async (req, res) => {
  try {
    const restaurant = await adminController.getRestaurant(req.params.id)
    return res.render('admin/create', { restaurant })
  } catch (e) {
    console.log(e)
  }
})
//編輯餐廳資訊
router.put('/restaurants/:id', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    await adminController.putRestaurant(req.file, req.body, req.params.id)
    setTimeout(() => {
      req.flash('success_messages', 'restaurant was successfully to update')
      return res.redirect('/admin/restaurants')
    }, 3000)
  } catch (e) {
    console.log(e)
  }
})
//刪除餐廳
router.delete('/restaurants/:id', async (req, res) => {
  try {
    await adminController.deleteRestaurant(req.params.id)
    return res.redirect('/admin/restaurants')
  } catch (e) {
    console.log(e)
  }
})

//顯示所有用戶頁面
router.get('/users', async (req, res) => {
  try {
    const users = await adminController.getUsers()
    return res.render('admin/users', { users })
  } catch (e) {
    console.log(e)
  }
})

//修改用戶權限
router.put('/users/:id/toggleAdmin', async (req, res) => {
  try {
    const user = await adminController.toggleAdmin(req.params.id)
    req.flash('success_messages', `${user.name} was successfully to change`)
    return res.redirect('/admin/users')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router