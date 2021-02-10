const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: async (user, body) => {
    return Comment.create({
      text: body.text,
      RestaurantId: body.restaurantId,
      UserId: user.id
    })
  }
}

module.exports = commentController