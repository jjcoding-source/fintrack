import { useState, useMemo, useEffect } from "react"
import { Filter, Search, Plus, Pencil, Trash2, X, Check } from "lucide-react"
import api from "../utils/api"

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(n)

const EMPTY_FORM = {
  title: "", amount: "", type: "expense", category: "", date: "", note: "",
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories]     = useState([])
  const [search, setSearch]             = useState("")
  const [filter, setFilter]             = useState("all")
  const [showModal, setShowModal]       = useState(false)
  const [editingId, setEditingId]       = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [deleteId, setDeleteId]         = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [txRes, catRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/categories"),
      ])
      setTransactions(txRes.data)
      setCategories(catRes.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesFilter = filter === "all" || t.type === filter
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [transactions, filter, search])

  const totalIncome  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(t) {
    setForm({
      title:    t.title,
      amount:   t.amount,
      type:     t.type,
      category: t.category,
      date:     t.date?.split("T")[0] || "",
      note:     t.note || "",
    })
    setEditingId(t._id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.title || !form.amount || !form.category || !form.date) return
    try {
      if (editingId) {
        const { data } = await api.put(`/transactions/${editingId}`, {
          ...form, amount: Number(form.amount),
        })
        setTransactions(prev => prev.map(t => t._id === editingId ? data : t))
      } else {
        const { data } = await api.post("/transactions", {
          ...form, amount: Number(form.amount),
        })
        setTransactions(prev => [data, ...prev])
      }
      setShowModal(false)
      setForm(EMPTY_FORM)
      setEditingId(null)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/transactions/${id}`)
      setTransactions(prev => prev.filter(t => t._id !== id))
      setDeleteId(null)
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight">Transactions</h2>
          <p className="text-gray-500 text-sm mt-0.5">{transactions.length} transactions total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Transaction
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Income",   value: fmt(totalIncome),               color: "text-emerald-400" },
          { label: "Total Expenses", value: fmt(totalExpense),              color: "text-red-400"     },
          { label: "Net Balance",    value: fmt(totalIncome - totalExpense), color: "text-blue-400"   },
        ].map((s, i) => (
          <div key={i} className="bg-[#13151F] border border-white/[0.07] rounded-2xl px-5 py-4">
            <p className="text-gray-500 text-[11px] tracking-widest uppercase mb-1">{s.label}</p>
            <p className={`font-black text-xl tracking-tight ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-[#13151F] border border-white/[0.07] rounded-xl px-4 py-2.5 focus-within:border-emerald-400/40 transition-colors">
          <Search size={14} className="text-gray-600 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} className="text-gray-600 hover:text-gray-300 transition-colors" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#13151F] border border-white/[0.07] rounded-xl p-1">
          {["all", "income", "expense"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all
                ${filter === f
                  ? "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 bg-[#13151F] border border-white/[0.07] rounded-xl px-4 py-2.5 text-gray-400 text-sm hover:bg-white/[0.06] transition-colors">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-5 py-3 border-b border-white/[0.07]">
          {["Transaction", "Category", "Date", "Amount", ""].map((h, i) => (
            <p key={i} className="text-[10px] text-gray-600 tracking-widest uppercase">{h}</p>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-600 text-sm">No transactions found</p>
          </div>
        ) : (
          filtered.map((t, i) => (
            <div
              key={t._id}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors
                ${i < filtered.length - 1 ? "border-b border-white/[0.04]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
                  {t.type === "income" ? "+" : "-"}
                </div>
                <div>
                  <p className="text-sm text-white">{t.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5 capitalize">{t.type}</p>
                </div>
              </div>

              <span className="inline-flex items-center w-fit bg-white/[0.05] text-gray-400 text-xs px-2.5 py-1 rounded-lg">
                {t.category}
              </span>

              <p className="text-xs text-gray-500">
                {new Date(t.date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                })}
              </p>

              <p className={`font-bold text-sm tabular-nums ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteId(t._id)}
                  className="w-7 h-7 rounded-lg bg-red-400/[0.08] flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#13151F] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-xl tracking-tight">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-white/[0.03] rounded-xl">
              {["expense", "income"].map(type => (
                <button
                  key={type}
                  onClick={() => setForm(f => ({ ...f, type, category: "" }))}
                  className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-colors
                    ${form.type === type
                      ? type === "expense"
                        ? "bg-red-400/15 text-red-400"
                        : "bg-emerald-400/15 text-emerald-400"
                      : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Grocery run"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 transition-colors"
                >
                <option value="" className="bg-[#13151F]">Select category</option>
                {categories
                  .filter(c => c.type === form.type)
                  .map(c => (
                    <option key={c._id} value={c.name} className="bg-[#13151F]">
                    {c.name}
                </option>
               ))
              }
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] text-gray-500 tracking-widests uppercase mb-1.5">Note (optional)</label>
              <textarea
                rows={2}
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Add a note..."
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-gray-400 text-sm hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold transition-colors"
              >
                <Check size={15} strokeWidth={2.5} />
                {editingId ? "Save Changes" : "Add Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-[#13151F] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-400/10 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-black text-lg tracking-tight mb-2">Delete Transaction</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The transaction will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-gray-400 text-sm hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-400/90 hover:bg-red-400 text-white text-sm font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}