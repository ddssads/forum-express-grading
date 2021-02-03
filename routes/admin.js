const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const auth = require('../middleware/auth')

router.use(auth.authenticatedAdmin)

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await adminController.getRestaurants()
    res.render('admin/restaurants', { restaurants })
  } catch (e) {
    console.log(e)
  }
})

router.get('/restaurants/create', adminController.createRestaurant)

router.post('/restaurants', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    await adminController.postRestaurant(req)
    req.flash('success_messages', 'restaurant was successfully created')
    return res.redirect('/admin/restaurants')
  } catch (e) {
    console.log(e)
  }
})
router.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await adminController.getRestaurant(req.params.id)
    res.render('admin/restaurant', { restaurant })
  } catch (e) {
    return console.log(e)
  }

})

router.get('/restaurants/:id/edit', async (req, res) => {
  try {
    const restaurant = await adminController.editRestaurant(req.params.id)
    return res.render('admin/create', { restaurant })
  } catch (e) {
    console.log(e)
  }
})

router.put('/restaurants/:id', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    await adminController.putRestaurant(req, res)
    req.flash('success_messages', 'restaurant was successfully to update')
    return res.redirect('/admin/restaurants')
  } catch (e) {
    console.log(e)
  }
})

router.delete('/restaurants/:id', async (req, res) => {
  try {
    await adminController.deleteRestaurant(req.params.id)
    return res.redirect('/admin/restaurants')
  } catch (e) {
    console.log(e)
  }
})


router.get('/users', async (req, res) => {
  try {
    const users = await adminController.getUsers()
    return res.render('admin/users', { users })
  } catch (e) {
    console.log(e)
  }
})


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