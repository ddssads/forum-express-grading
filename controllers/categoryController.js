const db = require('../models')
const Category = db.Category

const categoryController = {
  //取得所有分類資料
  getCategories: async (id) => {
    const categories = await Category.findAll({ raw: true, nest: true, })
    if (!id) {
      return categories
    }
    const categoryNoJson = await Category.findByPk(id)
    const category = categoryNoJson.toJSON()
    return { categories, category }
  },
  //新增一筆分類
  postCategory: async (body) => {
    const { name } = body
    return await Category.create({ name: name })
      .catch((e) => {
        console.log(e)
      })
  },
  putCategory: async (id, body) => {
    const category = await Category.findByPk(id)
    return category.update(body)
  },
  deleteCategory: async (id) => {
    const category = await Category.findByPk(id)
    return category.destroy()
  }
}

module.exports = categoryController