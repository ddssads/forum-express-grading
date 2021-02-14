const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const restController = require('../controllers/restController')
const handleErrorAsync = require('../_helpers').handleErrorAsync
const helpers = require('../_helpers')

router.use(auth.authenticated)
router.get('/', handleErrorAsync(async (req, res, next) => {
  const { data, categories, categoryId, totalPage, prev, nextPage, page } = await restController.getRestaurants(req.query, helpers.getUser(req))
  return res.render('restaurants', { restaurants: data, categories, categoryId, totalPage, prev, nextPage, page })
}))

//Feeds
router.get('/feeds', handleErrorAsync(async (req, res, next) => {
  const { restaurants, comments } = await restController.getFeeds()
  res.render('feeds', { restaurants, comments })
}))

router.get('/top', handleErrorAsync(async (req, res, next) => {
  const restaurants = await restController.getTopRestaurants(helpers.getUser(req))
  return res.render('topRestaurants', { restaurants })
}))
//顯示單一餐廳頁面
router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  const isLiked = await restController.checkIsLike(restaurant, helpers.getUser(req).id)
  const isFavorited = await restController.checkIsFavorited(restaurant, helpers.getUser(req).id)
  await restController.calculatorViewCounts(req.params.id)
  return res.render('restaurant', { restaurant, isFavorited, isLiked })
}))

//dashboard
router.get('/:id/dashboard', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  const totalCount = await restController.getTotalCountOfComment(req.params.id)
  return res.render('dashboard', { restaurant, totalCount })
}))


module.exports = router