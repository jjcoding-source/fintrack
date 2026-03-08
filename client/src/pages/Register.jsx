import { useState } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react"

export default function Register() {
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [loading, setLoading]             = useState(false)
  const [form, setForm]                   = useState({
    name: "", email: "", password: "", confirm: ""
  })

  const passwordMatch = form.password && form.confirm && form.password === form.confirm
  const passwordWrong = form.confirm && form.password !== form.confirm

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordWrong) return
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-[#08090E] flex">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-[#0F1117] border-r border-white/[0.07] relative overflow-hidden">

        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            fin<span className="text-emerald-400">track</span>
          </span>
        </div>

        {/* Center Content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] text-emerald-400 tracking-widest uppercase">Get started free</p>
            <h1 className="text-white font-black text-4xl tracking-tight leading-tight">
              Your financial<br />journey starts here.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              Join thousands of people who use fintrack to manage their money smarter every day.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3 pt-2">
            {[
              "Track income and expenses in real time",
              "Set budgets and get overspend alerts",
              "Visualize your spending with charts",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-gray-400 text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative text-gray-700 text-xs">
          Built with the MERN stack
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-7">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              fin<span className="text-emerald-400">track</span>
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-white font-black text-2xl tracking-tight">Create your account</h2>
            <p className="text-gray-500 text-sm mt-1">Free forever. No credit card required.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Alex Morgan"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] transition-colors"
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

            <div>
              <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat your password"
                  className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors
                    ${passwordWrong
                      ? "border-red-400/50 focus:border-red-400/70"
                      : passwordMatch
                      ? "border-emerald-400/50 focus:border-emerald-400/70"
                      : "border-white/[0.07] focus:border-emerald-400/40"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordWrong && (
                <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
              )}
              {passwordMatch && (
                <p className="text-emerald-400 text-xs mt-1.5">Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !!passwordWrong}
              className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#08090E] font-bold text-sm py-3 rounded-xl transition-colors mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#08090E]/30 border-t-[#08090E] rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}