const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const handleErrorAsync = require('../_helpers').handleErrorAsync


router.get('/admin/restaurants', handleErrorAsync(async (req, res, next) => {
  const restaurants = await adminController.getRestaurants()
  res.json({ restaurants })
}))

module.exports = router