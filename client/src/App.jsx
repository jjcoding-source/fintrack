import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budgets from "./pages/Budgets"
import Categories from "./pages/Categories"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { useAuth } from "./context/AuthContext"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets"      element={<Budgets />} />
          <Route path="categories"   element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}