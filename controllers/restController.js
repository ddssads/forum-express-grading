const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const Comment = db.Comment
const User = db.User
const pageLimit = 10


const restController = {
  getRestaurants: async (query) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (query.page) {
      offset = (query.page - 1) * pageLimit
    }
    if (query.categoryId) {
      categoryId = Number(query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    const result = await Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit })
    const page = Number(query.page) || 1
    const pages = Math.ceil(result.count / pageLimit)
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    const prev = page - 1 < 1 ? 1 : page - 1
    const nextPage = page + 1 > pages ? pages : page + 1
    const data = result.rows.map(r => ({
      ...r.dataValues,
      description: r.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    const categories = await Category.findAll({ raw: true, nest: true })
    return { data, categories, categoryId, totalPage, prev, nextPage, page }
  },
  getRestaurant: async (id) => {
    const restaurant = await Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
    return restaurant.toJSON()
  }
}
module.exports = restController