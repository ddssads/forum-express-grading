const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次輸入密碼不相同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(req.body.password, salt))
            .then(hash => User.create({
              name: req.body.name,
              email: req.body.email,
              password: hash
            }))
            .then(() => res.redirect('/signin'))
            .catch(err => console.log(err))
        }
      })
    }
  }
}

module.exports = userController