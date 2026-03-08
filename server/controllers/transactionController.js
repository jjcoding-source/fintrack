import Transaction from "../models/Transaction.js"


export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const transaction = await Transaction.create({
      user:     req.user._id,
      title,
      amount,
      type,
      category,
      date,
      note: note || "",
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await transaction.deleteOne()
    res.json({ message: "Transaction removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}