const express = require('express')
const router = express.Router()
const admin = require('./admin')
const home = require('./home')
const comment = require('./comment')
const user = require('./user')
const restaurant = require('./restaurant')
const favorite = require('./favorite')
const like = require('./like')
const following = require('./following')
//api route
const apiAdmin = require('./apis/admin')
const apiHome = require('./apis/home')
const apiUser = require('./apis/user')
const apiRestaurant = require('./apis/restaurant')
const apiComment = require('./apis/comment')

router.use('/admin', admin)
router.use('/', home)
router.use('/comments', comment)
router.use('/users', user)
router.use('/restaurants', restaurant)
router.use('/favorite', favorite)
router.use('/like', like)
router.use('/following', following)
//api route
router.use('/api/admin', apiAdmin)
router.use('/api/restaurants', apiRestaurant)
router.use('/api/users', apiUser)
router.use('/api/comments', apiComment)

router.use('/api', apiHome)

module.exports = router