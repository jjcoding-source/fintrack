import mongoose from "mongoose"

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, "Limit is required"],
      min: [0, "Limit must be positive"],
    },
    color: {
      type: String,
      default: "#4D9EFF",
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

const Budget = mongoose.model("Budget", budgetSchema)
export default Budget