const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const passport = require('passport')
const auth = require('../middleware/auth')

router.get('/', auth.authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', auth.authenticated, restController.getRestaurants)

router.get('/signup', userController.signUpPage)
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

router.get('/signin', userController.signInpage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router