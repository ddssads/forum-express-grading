const express = require('express')
const router = express.Router()
const admin = require('./admin')
const home = require('./home')

router.use('/admin', admin)
router.use('/', home)


module.exports = router