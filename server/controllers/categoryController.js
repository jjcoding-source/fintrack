import Category from "../models/Category.js"


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const createCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" })
    }

    const existingCategory = await Category.findOne({
      user: req.user._id,
      name,
    })

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" })
    }

    const category = await Category.create({
      user:  req.user._id,
      name,
      type,
      color: color || "#4D9EFF",
    })

    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await category.deleteOne()
    res.json({ message: "Category removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}