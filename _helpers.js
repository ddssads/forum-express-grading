function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

const handleErrorAsync = func => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  ensureAuthenticated,
  getUser,
  handleErrorAsync
};