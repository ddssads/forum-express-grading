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
const apiAdmin = require('./apis/admin')
const apiHome = require('./apis/home')

router.use('/admin', admin)
router.use('/', home)
router.use('/comments', comment)
router.use('/users', user)
router.use('/restaurants', restaurant)
router.use('/favorite', favorite)
router.use('/like', like)
router.use('/following', following)
router.use('/api/admin', apiAdmin)
router.use('/api', apiHome)

module.exports = router