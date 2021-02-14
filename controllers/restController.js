const { useFakeServer } = require('sinon')
const db = require('../models')
const user = require('../models/user')
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
    const result = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
    const page = Number(query.page) || 1 //當前頁數
    const pages = Math.ceil(result.count / pageLimit) //總頁數
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1) //用總頁數長度寫成一個陣列給前端套用
    const prev = page - 1 < 1 ? 1 : page - 1
    const nextPage = page + 1 > pages ? pages : page + 1
    //取出所需要餐廳資料
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
  getRestaurant: async (id) => {
    const restaurant = await Restaurant.findByPk(id, {
      include: [
        Category,
        { model: User, as: 'LikedUsers' },
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] }
      ]
    })
    return restaurant.toJSON()
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
  },
  checkIsLike: (restaurant, id) => {
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(id)
    return isLiked
  },
  checkIsFavorited: (restaurant, id) => {
    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(id)
    return isFavorited
  },
  getTopRestaurants: async (reqUser) => {
    let restaurants = await Restaurant.findAll({
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' }
      ]
    })
    restaurants = restaurants.map(r => ({
      ...r.dataValues,
      FavoritedCount: r.FavoritedUsers.length,
      isFavorited: reqUser.FavoritedRestaurants.map(d => d.id).includes(r.id),
      description: r.description.substring(0, 50),
    }))
    //取前十
    const topRestaurants = restaurants.sort((a, b) => b.FavoritedCount - a.FavoritedCount).slice(0, 10)
    return topRestaurants
  }
}
module.exports = restController