const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const restController = require('../controllers/restController')
const handleErrorAsync = require('../_helpers').handleErrorAsync

router.use(auth.authenticated)
router.get('/', auth.authenticated, handleErrorAsync(async (req, res, next) => {
  const { data, categories, categoryId, totalPage, prev, nextPage, page } = await restController.getRestaurants(req.query)
  return res.render('restaurants', { restaurants: data, categories, categoryId, totalPage, prev, nextPage, page })
}))

//Feeds
router.get('/feeds', handleErrorAsync(async (req, res, next) => {
  const { restaurants, comments } = await restController.getFeeds()
  res.render('feeds', { restaurants, comments })
}))
//dashboard
router.get('/dashboard/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  const totalCount = await restController.getTotalCountOfComment(req.params.id)
  return res.render('dashboard', { restaurant, totalCount })
}))

//顯示單一餐廳頁面
router.get('/:id', handleErrorAsync(async (req, res, next) => {
  const restaurant = await restController.getRestaurant(req.params.id)
  await restController.calculatorViewCounts(req.params.id)
  return res.render('restaurant', { restaurant })
}))

module.exports = router