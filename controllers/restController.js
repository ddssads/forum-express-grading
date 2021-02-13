const { useFakeServer } = require('sinon')
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const Comment = db.Comment
const User = db.User
const pageLimit = 10


const restController = {
  getRestaurants: async (query, user) => {
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
      categoryName: r.Category.name,
      isFavorited: user.FavoritedRestaurants.map(d => d.id).includes(r.id),
      isLiked: user.LikedRestaurants.map(d => d.id).includes(r.id)
    }))
    const categories = await Category.findAll({ raw: true, nest: true })
    return { data, categories, categoryId, totalPage, prev, nextPage, page }
  },
  getRestaurant: async (id, user) => {
    let restaurant = await Restaurant.findByPk(id, {
      include: [
        Category,
        { model: User, as: 'LikedUsers' },
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] }
      ]
    })
    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(user.id)
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(user.id)
    restaurant = restaurant.toJSON()
    return { restaurant, isFavorited, isLiked }
  },
  getFeeds: async () => {
    const restaurants = await Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    })
    const comments = await Comment.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant]
    })
    return { restaurants, comments }
  },
  getTotalCountOfComment: async (id) => {
    const totalCount = await Comment.count({ where: { RestaurantId: id } })
    return totalCount
  },
  calculatorViewCounts: async (id) => {
    await Restaurant.increment('viewCounts', { where: { id } })
  }
}

module.exports = restController