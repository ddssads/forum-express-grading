const fs = require('fs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const multer = require('multer')
const { resolve } = require('path')
const { rejects } = require('assert')
const upload = multer({ dest: 'temp/' })
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const adminController = {
  //取得所有餐廳資料
  getRestaurants: async function () {
    const restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
    return restaurants
  },
  //新增餐廳
  postRestaurant: (file, body) => {
    const { name, tel, address, opening_hours, description, categoryId } = body
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
          Restaurant.create({
            name: name,
            tel: tel,
            address: address,
            opening_hours: opening_hours,
            description: description,
            image: imgLink,
            CategoryId: categoryId
          })
        } catch (e) {
          console.log(e)
        }
      }
      return start()
    }
    return Restaurant.create({
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description,
      image: null,
      CategoryId: categoryId
    }).catch((e) => {
      console.log(e)
    })
  },
  //取得單一餐廳資料
  getRestaurant: async function (id) {
    try {
      const restaurant = await Restaurant.findByPk(id, { include: [Category] })
      return restaurant.toJSON()
    } catch (e) {
      console.log(e)
    }
  },
  //編輯單一餐廳資料
  putRestaurant: async (file, body, id) => {
    const { name, tel, address, opening_hours, description, categoryId } = body
    const restaurant = await Restaurant.findByPk(id)
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
          restaurant.update({
            name: name,
            tel: tel,
            address: address,
            opening_hours: opening_hours,
            description: description,
            image: imgLink,
            CategoryId: categoryId
          })
        } catch (e) {
          console.log(e)
        }
      }
      return start()
    }
    return restaurant.update({
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description,
      image: restaurant.image,
      CategoryId: categoryId
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
      await user.update({ isAdmin: !user.isAdmin })
      return user
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController