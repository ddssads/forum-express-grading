const helpers = require('../_helpers')
const passport = require('passport')

exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

exports.apiAuthenticated = passport.authenticate('jwt', { session: false })
exports.apiAuthenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}