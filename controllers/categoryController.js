const db = require('../models')
const Category = db.Category

const categoryController = {
  //取得所有分類資料
  getCategories: async () => {
    const categories = await Category.findAll({ raw: true, nest: true, })
    return categories
  },
  //新增一筆分類
  postCategory: async (body) => {
    const { name } = body
    return Category.create({ name: name })
      .catch((e) => {
        console.log(e)
      })
  },
}

module.exports = categoryController