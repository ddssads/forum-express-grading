const express = require('express')
const router = express.Router()
const admin = require('./admin')
const home = require('./home')
const comment = require('./comment')

router.use('/admin', admin)
router.use('/', home)
router.use('/comments', comment)


module.exports = router