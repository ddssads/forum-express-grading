const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant


const restController = {
  getRestaurants: async () => {
    const restaurants = await Restaurant.findAll({ include: Category })
    const data = restaurants.map(r => ({
      ...r.dataValues,
      description: r.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    return data
  },
  getRestaurant: async (id) => {
    const restaurant = await Restaurant.findByPk(id, { include: Category })
    return restaurant.toJSON()
  }
}
module.exports = restController