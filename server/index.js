import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes        from "./routes/authRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import budgetRoutes      from "./routes/budgetRoutes.js"
import categoryRoutes    from "./routes/categoryRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())


app.use("/api/auth",         authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/budgets",      budgetRoutes)
app.use("/api/categories",   categoryRoutes)


app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" })
})


app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ message: err.message || "Server error" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))