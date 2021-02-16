const imgur = require('imgur-node-api')

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

const imgPromise = (file) => {
  return new Promise((resolve, reject) => {
    imgur.upload(file.path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img.data.link)
    })
  })
}

module.exports = {
  ensureAuthenticated,
  getUser,
  handleErrorAsync,
  imgPromise
};