export const mockTransactions = [
  { _id:"1",  title:"Monthly Rent",      amount:1200, type:"expense", category:"Housing",       icon:"🏠", date:"2025-03-01" },
  { _id:"2",  title:"Salary Deposit",    amount:4500, type:"income",  category:"Salary",        icon:"💼", date:"2025-03-01" },
  { _id:"3",  title:"Grocery Run",       amount:95,   type:"expense", category:"Food",          icon:"🍜", date:"2025-03-03" },
  { _id:"4",  title:"Netflix",           amount:18,   type:"expense", category:"Entertainment", icon:"🎬", date:"2025-03-04" },
  { _id:"5",  title:"Freelance Payment", amount:800,  type:"income",  category:"Freelance",     icon:"💻", date:"2025-03-05" },
  { _id:"6",  title:"Gym Membership",    amount:45,   type:"expense", category:"Health",        icon:"💊", date:"2025-03-06" },
  { _id:"7",  title:"Uber Rides",        amount:34,   type:"expense", category:"Transport",     icon:"🚗", date:"2025-03-08" },
  { _id:"8",  title:"Amazon Order",      amount:120,  type:"expense", category:"Shopping",      icon:"🛍️", date:"2025-03-10" },
  { _id:"9",  title:"Dividends",         amount:220,  type:"income",  category:"Investment",    icon:"📈", date:"2025-03-12" },
  { _id:"10", title:"Restaurant Dinner", amount:78,   type:"expense", category:"Food",          icon:"🍜", date:"2025-03-14" },
]

export const mockBudgets = [
  { _id:"1", category:"Housing",       icon:"🏠", limit:1300, color:"#4D9EFF" },
  { _id:"2", category:"Food",          icon:"🍜", limit:400,  color:"#FFD166" },
  { _id:"3", category:"Transport",     icon:"🚗", limit:150,  color:"#4ADE80" },
  { _id:"4", category:"Health",        icon:"💊", limit:100,  color:"#FF8FAB" },
  { _id:"5", category:"Shopping",      icon:"🛍️", limit:200,  color:"#B57BFF" },
  { _id:"6", category:"Entertainment", icon:"🎬", limit:80,   color:"#FF5F7E" },
]

export const mockCategories = [
  { _id:"1", name:"Housing",       icon:"🏠", type:"expense", color:"#4D9EFF" },
  { _id:"2", name:"Food",          icon:"🍜", type:"expense", color:"#FFD166" },
  { _id:"3", name:"Transport",     icon:"🚗", type:"expense", color:"#4ADE80" },
  { _id:"4", name:"Health",        icon:"💊", type:"expense", color:"#FF8FAB" },
  { _id:"5", name:"Shopping",      icon:"🛍️", type:"expense", color:"#B57BFF" },
  { _id:"6", name:"Entertainment", icon:"🎬", type:"expense", color:"#FF5F7E" },
  { _id:"7", name:"Salary",        icon:"💼", type:"income",  color:"#00E5A0" },
  { _id:"8", name:"Freelance",     icon:"💻", type:"income",  color:"#4D9EFF" },
  { _id:"9", name:"Investment",    icon:"📈", type:"income",  color:"#B57BFF" },
]

export const mockMonthlyFlow = [
  { month:"Oct", income:4800, expense:2900 },
  { month:"Nov", income:5100, expense:3200 },
  { month:"Dec", income:5800, expense:4100 },
  { month:"Jan", income:4600, expense:2700 },
  { month:"Feb", income:5200, expense:3100 },
  { month:"Mar", income:5520, expense:1590 },
]