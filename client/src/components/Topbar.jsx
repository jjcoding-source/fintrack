import { useLocation } from "react-router-dom"
import { Bell, Search } from "lucide-react"

const pageTitles = {
  "/dashboard":    { title: "Dashboard",    subtitle: "Welcome back, Alex 👋" },
  "/transactions": { title: "Transactions", subtitle: "Track every dollar in and out" },
  "/budgets":      { title: "Budgets",      subtitle: "Set limits, stay on track" },
  "/categories":   { title: "Categories",   subtitle: "Organize your money by type" },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const { title, subtitle } = pageTitles[pathname] || { title: "fintrack", subtitle: "" }

  return (
    <header className="shrink-0 h-16 bg-[#0F1117] border-b border-white/[0.07] flex items-center justify-between px-8">
      <div>
        <h1 className="text-white font-black text-lg tracking-tight leading-none">{title}</h1>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 w-48 group focus-within:border-emerald-400/40 transition-colors">
          <Search size={13} className="text-gray-600 group-focus-within:text-emerald-400 transition-colors shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center hover:bg-white/[0.08] transition-colors group">
          <Bell size={15} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        {/* Date */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
          <p className="text-xs text-gray-500 font-mono">
            {new Date().toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric"
            })}
          </p>
        </div>
      </div>
    </header>
  )
}