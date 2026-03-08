import { createContext, useContext, useState, useEffect } from "react"
import api from "../utils/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem("user")) || null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function register(name, email, password) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post("/auth/register", { name, email, password })
      localStorage.setItem("user", JSON.stringify(data))
      setUser(data)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post("/auth/login", { email, password })
      localStorage.setItem("user", JSON.stringify(data))
      setUser(data)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}