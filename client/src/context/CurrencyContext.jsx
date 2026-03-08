import { createContext, useContext, useState } from "react"

const CurrencyContext = createContext()

export const CURRENCIES = [
  { code: "USD", symbol: "$",  name: "US Dollar"     },
  { code: "INR", symbol: "₹",  name: "Indian Rupee"  },
  { code: "EUR", symbol: "€",  name: "Euro"          },
  { code: "GBP", symbol: "£",  name: "British Pound" },
  { code: "JPY", symbol: "¥",  name: "Japanese Yen"  },
  { code: "AED", symbol: "د.إ",name: "UAE Dirham"    },
  { code: "CAD", symbol: "CA$",name: "Canadian Dollar"},
  { code: "AUD", symbol: "A$", name: "Australian Dollar"},
]

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem("currency")
    return saved ? JSON.parse(saved) : CURRENCIES[0]
  })

  function changeCurrency(code) {
    const selected = CURRENCIES.find(c => c.code === code)
    if (selected) {
      setCurrency(selected)
      localStorage.setItem("currency", JSON.stringify(selected))
    }
  }

  function fmt(amount) {
    return new Intl.NumberFormat("en-US", {
      style:                 "currency",
      currency:              currency.code,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, fmt }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}