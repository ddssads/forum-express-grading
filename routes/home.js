const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('passport')
const auth = require('../middleware/auth')
const restController = require('../controllers/restController')
const handleErrorAsync = func => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}

router.get('/', auth.authenticated, (req, res) => res.redirect('/restaurants'))
//顯示所有餐廳頁面
router.get('/restaurants', auth.authenticated, handleErrorAsync(async (req, res, next) => {
  const restaurants = await restController.getRestaurants()
  return res.render('restaurants', { restaurants })
}))
//顯示單一餐廳頁面
router.get('/restaurants/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  return res.render('restaurant', { restaurant })
}))
router.get('/signup', (req, res) => {
  return res.render('signup')
})
router.post('/signup', handleErrorAsync(async (req, res, next) => {
  if (req.body.passwordCheck !== req.body.password) {
    req.flash('error_messages', '兩次輸入密碼不相同！')
    return res.redirect('/signup')
  }
  const user = await userController.checkUser(req.body.email)
  if (user) {
    req.flash('error_messages', '信箱重複！')
    return res.redirect('/signup')
  } else {
    userController.signUp(req.body.name, req.body.email, req.body.password)
    req.flash('success_messages', '註冊成功！')
    return res.redirect('/signin')
  }
}))

router.get('/signin', (req, res) => {
  return res.render('signin')
})
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/signin',
  successFlash: true,
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.flash('success_messages', '成功登出！')
  req.logout()
  res.redirect('/signin')
})

module.exports = router