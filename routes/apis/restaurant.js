const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const restController = require('../../controllers/restController')
const handleErrorAsync = require('../../_helpers').handleErrorAsync
const helpers = require('../../_helpers')

router.use(auth.apiAuthenticated)
//首頁資訊
router.get('/', handleErrorAsync(async (req, res, next) => {
  const { data, categories, categoryId, totalPage, prev, nextPage, page } = await restController.getRestaurants(req.query, helpers.getUser(req))
  return res.json({ restaurants: data, categories, categoryId, totalPage, prev, nextPage, page })
}))

//最新動態資訊
router.get('/feeds', handleErrorAsync(async (req, res, next) => {
  const { restaurants, comments } = await restController.getFeeds()
  res.json({ restaurants, comments })
}))
//topRestaurants 資訊
router.get('/top', handleErrorAsync(async (req, res, next) => {
  const restaurants = await restController.getTopRestaurants(helpers.getUser(req))
  return res.json({ restaurants })
}))
//單一餐廳資訊
router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  const isLiked = await restController.checkIsLike(restaurant, helpers.getUser(req).id)
  const isFavorited = await restController.checkIsFavorited(restaurant, helpers.getUser(req).id)
  await restController.calculatorViewCounts(req.params.id)
  return res.json({ restaurant, isFavorited, isLiked })
}))

//dashboard資訊
router.get('/:id/dashboard', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  const totalCount = await restController.getTotalCountOfComment(req.params.id)
  const totalFavoritedUsers = await restController.getTotalFavorited(restaurant)
  return res.json({ restaurant, totalCount, totalFavoritedUsers })
}))


module.exports = router