const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: async (user, body) => {
    return await Comment.create({
      text: body.text,
      RestaurantId: body.restaurantId,
      UserId: user.id
    })
  },

  deleteComment: async (id) => {
    const commit = await Comment.findByPk(id)
    return await commit.destroy()
  }
}

module.exports = commentController