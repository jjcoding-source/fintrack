import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm]                 = useState({ email: "", password: "" })
  const { login, loading, error }       = useAuth()
  const navigate                        = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const success = await login(form.email, form.password)
    if (success) navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#08090E] flex">

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-[#0F1117] border-r border-white/[0.07] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            fin<span className="text-emerald-400">track</span>
          </span>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] text-emerald-400 tracking-widest uppercase">Personal Finance</p>
            <h1 className="text-white font-black text-4xl tracking-tight leading-tight">
              Take control of<br />your money.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              Track every transaction, set budgets, and watch your savings grow — all in one place.
            </p>
          </div>
          <div className="flex gap-8 pt-2">
            {[
              { value: "71%",   label: "Avg savings rate"    },
              { value: "$3.9k", label: "Saved this month"    },
              { value: "10+",   label: "Categories tracked"  },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-white font-black text-2xl tracking-tight">{s.value}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-gray-700 text-xs">Built with the MERN stack</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              fin<span className="text-emerald-400">track</span>
            </span>
          </div>

          <div>
            <h2 className="text-white font-black text-2xl tracking-tight">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase">Password</label>
                <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#08090E] font-bold text-sm py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#08090E]/30 border-t-[#08090E] rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <p className="text-gray-600 text-xs">or</p>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}