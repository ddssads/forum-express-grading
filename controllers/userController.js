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
const imgPromise = require('../_helpers').imgPromise
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
//jwt
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  //sign in by token
  signIn: async (body) => {
    if (!body.email || !body.password) {
      return ({ status: 'error', message: 'required fields didn\'t exist' })
    }
    //檢查信箱密碼
    let username = body.email
    let password = body.password
    const user = await User.findOne({ where: { email: username } })
    if (!user) {
      return ({ status: 'error', message: 'no such user found' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return ({ status: 'error', message: 'passwords did not match' })
    }
    //簽發token
    var payload = { id: user.id }
    var token = jwt.sign(payload, process.env.JWT_SECRET)
    return (({
      status: 'success',
      message: 'ok',
      token: token,
      user: {
        id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
      }
    }))
  },
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
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },//誰在追蹤我
        { model: User, as: 'Followings' }//我在追蹤誰
      ]
    })
    return user.toJSON()
  },
  //找出使用者收藏追蹤被追蹤的總數
  getUserTotalData: (user) => {
    const totalFavoritedRestaurants = user.FavoritedRestaurants.length
    const totalFollowings = user.Followings.length//追蹤誰
    const totalFollowers = user.Followers.length//誰在追蹤
    return { totalFavoritedRestaurants, totalFollowings, totalFollowers }
  },
  getUserComment: async (id) => {
    const set = new Set()
    let commentsData = await Comment.findAndCountAll({ include: Restaurant, where: { UserId: id } })
    commentsData = commentsData.rows.map((c, i) => ({
      ...c.dataValues,
      restaurantImage: c.Restaurant.image,
      restaurantName: c.Restaurant.name,
    }))
    //刪除重複評論
    const result = commentsData.filter(item => !set.has(item.RestaurantId) ? set.add(item.RestaurantId) : false)
    const totalComments = result.length
    return { result, totalComments }
  },
  putUser: async (file, body, id) => {
    const user = await User.findByPk(id)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      async function start() {
        try {
          let imgLink = await imgPromise(file)
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