const express = require('express')
const router = express.Router()
const admin = require('./admin')
const home = require('./home')
const comment = require('./comment')
const user = require('./user')
const restaurant = require('./restaurant')

router.use('/admin', admin)
router.use('/', home)
router.use('/comments', comment)
router.use('/users', user)
router.use('/restaurants', restaurant)


module.exports = router