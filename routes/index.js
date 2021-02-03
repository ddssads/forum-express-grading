const helpers = require('../_helpers')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const { authenticate } = require('passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const express = require('express')
const router = express.Router()
const admin = require('./admin')
const home = require('./home')

router.use('/admin', admin)
router.use('/', home)
module.exports = router

