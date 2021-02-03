const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User


const adminController = {
  getRestaurants: async function () {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true })
    return restaurants
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req) => {
    const file = req.file
    console.log(file)
    if (file) {
      console.log('@@@')
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
        }).catch(err => console.log(err))
      })
    } else {
      console.log('@@@@@nofile')
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      })
        .catch(err => console.log(err))
    }
  },
  getRestaurant: async function (id) {
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      return restaurant
    } catch (e) {
      console.log(e)
    }
  },
  editRestaurant: async function (id) {
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      return restaurant
    } catch (e) {
      console.log(e)
    }
  },
  putRestaurant: (req) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
            })
              .catch((err) => {
                console.log(err)
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  },
  deleteRestaurant: async function (id) {
    try {
      const restaurant = await Restaurant.findByPk(id)
      restaurant.destroy()
    } catch (e) {
      console.log(e)
    }
  },
  getUsers: async function () {
    try {
      const users = User.findAll({ raw: true, nest: true })
      return users
    } catch (e) {
      console.log(err)
    }
  },
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