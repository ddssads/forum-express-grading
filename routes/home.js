const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('passport')
const auth = require('../middleware/auth')

router.get('/', auth.authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', auth.authenticated, (req, res) => {
  return res.render('restaurants')
})

router.get('/signup', (req, res) => {
  return res.render('signup')
})
router.post('/signup', async (req, res) => {
  try {
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
      return res.redirect('/signin')
    }
  } catch (e) {
    return console.log(e)
  }
})

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