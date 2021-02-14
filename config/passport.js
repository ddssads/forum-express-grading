const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Like = db.Like

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      User.findOne({ where: { email: username } }).then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼不正確！'))
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return cb(null, false, req.flash('error_messages', '帳號或密碼不正確！'))
          }
          return cb(null, user, req.flash('success_messages', '登入成功！'))
        })
      })
    }
  ))

  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser((id, cb) => {
    User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },//誰在追蹤我
        { model: User, as: 'Followings' }//我在追蹤誰
      ]
    }).then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
  })
}
