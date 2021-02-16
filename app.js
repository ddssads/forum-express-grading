const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const helpers = require('./_helpers')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('./routes/index')
const passport = require('./config/passport')
const AppError = require('./error')
const errorHandler = require('./middleware/err')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('./models')
const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

passport(app)

app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
app.use(routes)
app.all('*', (req, res, next) => {
  appErr = new AppError(`Can't find ${req.originalUrl}`, 404)
  next(appErr)
})
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


module.exports = app
