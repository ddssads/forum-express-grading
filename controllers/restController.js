const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant


const restController = {
  getRestaurants: async (id) => {
    const whereQuery = {}
    let categoryId = ''
    if (id) {
      categoryId = Number(id)
      whereQuery.CategoryId = categoryId
    }
    const restaurants = await Restaurant.findAll({ include: Category, where: whereQuery })
    const data = restaurants.map(r => ({
      ...r.dataValues,
      description: r.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    const categories = await Category.findAll({ raw: true, nest: true })
    return { data, categories }
  },
  getRestaurant: async (id) => {
    const restaurant = await Restaurant.findByPk(id, { include: Category })
    return restaurant.toJSON()
  }
}
module.exports = restController