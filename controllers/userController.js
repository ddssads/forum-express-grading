const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  //檢查email是否已經註冊
  checkUser: async function (email) {
    try {
      const user = await User.findOne({ where: { email } })
      return user
    } catch (e) {
      return console.log(e)
    }
  },
  //使用者註冊
  signUp: (name, email, password) => {
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name: name,
        email: email,
        password: hash
      }))
      .catch(err => console.log(err))
  }
}

module.exports = userController