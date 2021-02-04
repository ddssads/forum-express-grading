const fs = require('fs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const Restaurant = db.Restaurant
const User = db.User


const adminController = {
  //取得所有餐廳資料
  getRestaurants: async function () {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true })
    return restaurants
  },
  //新增餐廳
  postRestaurant: (file, body) => {
    const { name, tel, address, opening_hours, description } = body
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      return imgur.upload(file.path, (err, img) => {
        Restaurant.create({
          name: name,
          tel: tel,
          address: address,
          opening_hours: opening_hours,
          description: description,
          image: file ? img.data.link : null,
        })
          .catch((err) => {
            console.log(err)
          })
      })
    }
    return Restaurant.create({
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description,
      image: null
    })
      .catch(err => console.log(err))
  },
  //取得單一餐廳資料
  getRestaurant: async function (id) {
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      return restaurant
    } catch (e) {
      console.log(e)
    }
  },
  //編輯單一餐廳資料
  putRestaurant: async (file, body, id) => {
    const { name, tel, address, opening_hours, description } = body
    const restaurant = await Restaurant.findByPk(id)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      return imgur.upload(file.path, (err, img) => {
        restaurant.update({
          name: name,
          tel: tel,
          address: address,
          opening_hours: opening_hours,
          description: description,
          image: file ? img.data.link : restaurant.image
        })
      })
    }
    return restaurant.update({
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description,
      image: restaurant.image
    })
  },
  //刪除單一餐廳
  deleteRestaurant: async function (id) {
    try {
      const restaurant = await Restaurant.findByPk(id)
      restaurant.destroy()
    } catch (e) {
      console.log(e)
    }
  },
  //取得所有用戶資料
  getUsers: async function () {
    try {
      const users = User.findAll({ raw: true, nest: true })
      return users
    } catch (e) {
      console.log(err)
    }
  },
  //更改用戶權限
  toggleAdmin: async function (id) {
    try {
      const user = await User.findByPk(id)
      if (user.isAdmin) {
        user.update({
          isAdmin: false
        })
      } else {
        user.update({
          isAdmin: true
        })
      }
      return user
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController