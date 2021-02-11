const bcrypt = require('bcryptjs')
const db = require('../models')
const Comment = db.Comment
const Restaurant = db.Restaurant
const User = db.User
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur-node-api')
const router = require('../routes/comment')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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
  },
  getUser: async function (id) {
    const user = await User.findByPk(id)
    return user.toJSON()
  },
  getUserComment: async function (id) {
    const comments = await Comment.findAndCountAll({ include: Restaurant, where: { UserId: id } })
    const userComments = comments.rows.map((c, i) => ({
      ...c.dataValues,
      restaurantImage: c.Restaurant.image
    }))
    const totalComments = comments.count
    return { userComments, totalComments }
  },
  putUser: async function (file, body, id) {
    const user = await User.findByPk(id)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      //將upload寫成promise物件處理非同步
      const imgPromise = () => {
        return new Promise((resolve, reject) => {
          imgur.upload(file.path, (err, img) => {
            return resolve(img.data.link)
          })
        })
      }
      async function start() {
        try {
          let imgLink = await imgPromise()
          console.log(imgLink)
          user.update({
            name: body.name,
            image: imgLink
          })
        } catch (e) {
          console.log(e)
        }
      }
      return start()
    }
    return user.update({
      name: body.name,
      image: user.image,
    })
  }
}
module.exports = userController