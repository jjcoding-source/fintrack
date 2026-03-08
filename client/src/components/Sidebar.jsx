import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Tag,
  LogOut,
  TrendingUp,
} from "lucide-react"

const navItems = [
  { label: "Dashboard",    path: "/dashboard",    icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { label: "Budgets",      path: "/budgets",      icon: Target },
  { label: "Categories",   path: "/categories",   icon: Tag },
]
import { useCurrency, CURRENCIES } from "../context/CurrencyContext"

export default function Sidebar() {
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { currency, changeCurrency } = useCurrency()

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0F1117] border-r border-white/[0.07] px-3 py-6">

      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            fin<span className="text-emerald-400">track</span>
          </span>
        </div>
        <p className="text-[10px] text-gray-600 tracking-widest mt-1 ml-10">
          PERSONAL FINANCE
        </p>
      </div>

      {/* Nav Label */}
      <p className="text-[10px] text-gray-700 tracking-widest px-3 mb-2">MENU</p>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
              ${isActive
                ? "bg-emerald-400/10 text-emerald-400 font-medium"
                : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={isActive
                    ? "text-emerald-400"
                    : "text-gray-600 group-hover:text-gray-300"
                  }
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Currency Selector */}
      <div className="mx-1 mb-2">
        <p className="text-[10px] text-gray-700 tracking-widest uppercase mb-1.5 px-1">Currency</p>
        <select
          value={currency.code}
          onChange={e => changeCurrency(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-emerald-400/40 transition-colors"
        >
         {CURRENCIES.map(c => (
           <option key={c.code} value={c.code} className="bg-[#0F1117]">
             {c.symbol} {c.name}
           </option>
         ))}
       </select>
     </div>


      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-3">
        {/* Savings Card */}
        <div className="mx-1 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-blue-400/10 border border-emerald-400/10">
          <p className="text-[10px] text-emerald-400 tracking-widest mb-1">MARCH 2025</p>
          <p className="text-xl font-black text-white tracking-tight">$3,930</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Net savings this month</p>
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-sm font-bold text-[#08090E] shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.name || "User"}</p>
            <p className="text-[11px] text-gray-600">Free plan</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/login") }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <LogOut size={14} className="text-gray-500 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  )
}