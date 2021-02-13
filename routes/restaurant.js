const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const restController = require('../controllers/restController')
const handleErrorAsync = require('../_helpers').handleErrorAsync

router.use(auth.authenticated)
router.get('/', handleErrorAsync(async (req, res, next) => {
  const { data, categories, categoryId, totalPage, prev, nextPage, page } = await restController.getRestaurants(req.query, req.user)
  return res.render('restaurants', { restaurants: data, categories, categoryId, totalPage, prev, nextPage, page })
}))

//Feeds
router.get('/feeds', handleErrorAsync(async (req, res, next) => {
  const { restaurants, comments } = await restController.getFeeds()
  res.render('feeds', { restaurants, comments })
}))
//顯示單一餐廳頁面
router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const { restaurant, isFavorited } = await restController.getRestaurant(req.params.id, req.user)
  await restController.calculatorViewCounts(req.params.id)
  return res.render('restaurant', { restaurant, isFavorited })
}))

//dashboard
router.get('/:id/dashboard', handleErrorAsync(async (req, res, next) => {
  const { restaurant } = await restController.getRestaurant(req.params.id, req.user)
  const totalCount = await restController.getTotalCountOfComment(req.params.id)
  return res.render('dashboard', { restaurant, totalCount })
}))


module.exports = router