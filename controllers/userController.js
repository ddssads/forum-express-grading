const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  checkUser: async function (email) {
    try {
      const user = await User.findOne({ where: { email } })
      return user
    } catch (e) {
      return console.log(e)
    }
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (name, email, password) => {
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name: name,
        email: email,
        password: hash
      }))
      .catch(err => console.log(err))
  },
  signInpage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController