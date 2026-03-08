import Budget from "../models/Budget.js"


export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.json(budgets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const createBudget = async (req, res) => {
  try {
    const { category, limit, color, month, year } = req.body

    if (!category || !limit || !month || !year) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category,
      month,
      year,
    })

    if (existingBudget) {
      return res.status(400).json({ message: "Budget for this category already exists" })
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      color: color || "#4D9EFF",
      month,
      year,
    })

    res.status(201).json(budget)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" })
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" })
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await budget.deleteOne()
    res.json({ message: "Budget removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}