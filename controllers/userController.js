const bcrypt = require('bcryptjs')
const db = require('../models')
const Comment = db.Comment
const Restaurant = db.Restaurant
const User = db.User
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur-node-api')
const router = require('../routes/comment')
const { use } = require('../routes/comment')
const restaurant = require('../models/restaurant')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userController = {
  //檢查email是否已經註冊
  checkUser: async (email) => {
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
  getUser: async (id) => {
    const user = await User.findByPk(id)
    return user.toJSON()
  },
  getUserComment: async (id) => {
    const comments = await Comment.findAndCountAll({ include: Restaurant, where: { UserId: id } })
    const userComments = comments.rows.map((c, i) => ({
      ...c.dataValues,
      restaurantImage: c.Restaurant.image,
      restaurantName: c.Restaurant.name,
    }))
    const totalComments = comments.count
    return { userComments, totalComments }
  },
  putUser: async (file, body, id) => {
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
  },
  addFavorite: async (userId, restaurantId) => {
    await Favorite.create({
      UserId: userId,
      RestaurantId: restaurantId
    })
  },
  removeFavorite: async (userId, restaurantId) => {
    const favorite = await Favorite.findOne({
      where: {
        UserId: userId,
        RestaurantId: restaurantId
      }
    })
    await favorite.destroy()
  },
  addLike: async (userId, restaurantId) => {
    await Like.create({
      UserId: userId,
      RestaurantId: restaurantId
    })
  },
  removeLike: async (userId, restaurantId) => {
    const like = await Like.findOne({
      where: {
        UserId: userId,
        RestaurantId: restaurantId
      }
    })
    await like.destroy()
  },
  getTopUser: async (reqUser) => {
    const usersData = await User.findAll({
      include: [
        { model: User, as: 'Followers' } //找出每個User被追蹤的名單(user.Followers)
      ]
    })
    let users = usersData.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length, //遍歷所有user的追蹤者名單，計算有多少個追蹤者
      isFollowed: reqUser.Followings.map(d => d.id).includes(user.id) //找出當前使用者正在追蹤的所有使用者ID(d.id)，再去比對其他使用者id如果有就代表有被當前登入者追蹤
    }))
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
    return users
  },
  addFollowing: async (followerId, followingId) => {
    await Followship.create({ followerId, followingId })
  },
  removeFollowing: async (followerId, followingId) => {
    const awaitRemove = await Followship.findOne({
      where: { followerId, followingId }
    })
    await awaitRemove.destroy()
  }
}
module.exports = userController