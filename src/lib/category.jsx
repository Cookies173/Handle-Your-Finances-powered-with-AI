export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "income",
    color: "#16a34a", // green-600
    icon: "Briefcase",
  },
  {
    id: "dividends",
    name: "Dividends",
    type: "income",
    color: "#059669", // emerald-600
    icon: "Coins",
  },
  {
    id: "bankInterest",
    name: "Bank Interest",
    type: "income",
    color: "#0891b2", // cyan-600
    icon: "Landmark",
  },
  {
    id: "rental",
    name: "Rental",
    type: "income",
    color: "#d97706", // amber-600
    icon: "Building",
  },
  {
    id: "splitReturn",
    name: "Split Return",
    type: "income",
    color: "#db2777", // pink-600
    icon: "Users",
  },
  {
    id: "familyIncome",
    name: "Vyavaharik",
    type: "income",
    color: "#c026d3", // fuchsia-600
    icon: "Users",
  },
  {
    id: "otherIncome",
    name: "Other Income",
    type: "income",
    color: "#475569", // slate-600
    icon: "PlusCircle",
  },

  // Invested Categories
  {
    id: "emergencyFund",
    name: "Emergency Fund",
    type: "invested",
    color: "#15803d", // green-700
    icon: "ShieldCheck",
  },
  {
    id: "retirement",
    name: "Retirement",
    type: "invested",
    color: "#0ea5e9", // sky-500
    icon: "Clock",
  },
  {
    id: "stockPortfolio",
    name: "Stock Portfolio",
    type: "invested",
    color: "#4338ca", // indigo-700
    icon: "BarChart3",
  },
  {
    id: "mutualFunds",
    name: "Mutual Funds",
    type: "invested",
    color: "#7c3aed", // violet-600
    icon: "PieChart",
  },
  {
    id: "bonds",
    name: "Bonds",
    type: "invested",
    color: "#be185d", // rose-700
    icon: "FileText",
  },
  {
    id: "interBankTransfer",
    name: "Inter Bank Transfer",
    type: "invested",
    color: "#0ea5e9", // sky-500
    icon: "ArrowRightLeft",
  },
  {
    id: "otherInvestment",
    name: "Other Investment",
    type: "invested",
    color: "#334155", // slate-700
    icon: "TrendingUp",
  },

  // Expense Categories
  {
    id: "entertainment",
    name: "Entertainment",
    type: "expense",
    color: "#7c3aed", // violet-600
    icon: "Popcorn",
    description: "Non-essential fun activities",
    subcategories: ["Movie tickets", "Gaming purchases", "OTT subscriptions", "Concerts / events", "Theme parks", "Clubs / parties", "Hobby expenses"],
  },
  {
    id: "eatingOut",
    name: "Eating Out",
    type: "expense",
    color: "#f43f5e", // rose-500
    icon: "Utensils",
    description: "Food consumed outside home",
    subcategories: ["Restaurants", "Cafes", "Swiggy / Zomato orders", "Street food", "Office canteen", "Date nights"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "expense",
    color: "#65a30d", // lime-600
    icon: "ShoppingCart",
    description: "Daily household food supplies",
    subcategories: ["Vegetables, fruits", "Dairy products", "Rice, wheat, pulses", "Cooking oil, spices", "Packaged food", "Water cans"],
  },
  {
    id: "housing",
    name: "Housing",
    type: "expense",
    color: "#dc2626", // red-600
    icon: "Home",
    description: "Everything related to living space",
    subcategories: ["Rent / Home EMI", "Appliances (AC, fridge, washing machine)", "Property tax", "Maintenance charges", "Repairs", "Furniture"],
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "expense",
    color: "#475569", // slate-600
    icon: "Shield",
    description: "Risk protection payments",
    subcategories: ["Life insurance", "Home insurance", "Vehicle insurance", "Health insurance", "Term insurance", "Travel insurance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "expense",
    color: "#ea580c", // orange-600
    icon: "Car",
    description: "Cost of moving from place to place",
    subcategories: ["Fuel", "Public Transport", "Vehicle servicing", "Parking charges", "Cab rides", "Metro pass", "Car EMI"],
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "expense",
    color: "#0891b2", // cyan-600
    icon: "Plug",
    description: "Recurring essential services",
    subcategories: ["Electricity bill", "Water bill", "Gas cylinder", "Mobile recharge", "Daily Essentials"],
  },
  {
    id: "bodyCare&Medicine",
    name: "Body Care & Medicine",
    type: "expense",
    color: "#16a34a", // green-600
    icon: "HeartPulse",
    description: "Personal health & hygiene",
    subcategories: ["Medicines", "Doctor visits", "Medical tests", "Gym membership", "Salon expenses", "Skincare", "Toiletries"],
  },
  {
    id: "vacation",
    name: "Vacation",
    type: "expense",
    color: "#0d9488", // teal-600
    icon: "Plane",
    description: "Travel-related expenses",
    subcategories: ["Flight tickets", "Train tickets", "Hotel bookings", "Local sightseeing", "Travel food"],
  },
  {
    id: "clothing",
    name: "Clothing",
    type: "expense",
    color: "#4f46e5", // indigo-600
    icon: "Shirt",
    description: "Apparel & fashion",
    subcategories: ["Casual wear", "Formal wear", "Shoes", "Accessories", "Tailoring", "Seasonal shopping"],
  },
  {
    id: "familyExpenses",
    name: "Vyavaharik",
    type: "expense",
    color: "#c026d3", // fuchsia-600
    icon: "Users",
    description: "Shared or dependent-related expenses",
    subcategories: ["Parents' medical expenses", "Family gifts", "Household help salary", "Relatives support", "Festival expenses"],
  },
  {
    id: "otherExpense",
    name: "Other Expenses",
    type: "expense",
    color: "#64748b", // slate-500
    icon: "MoreHorizontal",
  },
  // {
  //   id: "travel",
  //   name: "Travel",
  //   type: "expense",
  //   color: "#0ea5e9", // sky-500
  //   icon: "Plane",
  // },
  // {
  //   id: "gifts",
  //   name: "Gifts & Donations",
  //   type: "expense",
  //   color: "#f472b6", // pink-400
  //   icon: "Gift",
  // },
  // {
  //   id: "bills",
  //   name: "Bills & Fees",
  //   type: "expense",
  //   color: "#fb7185", // rose-400
  //   icon: "Receipt",
  //   subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  // },
];

export const idToColor = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});

export const idToName = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.name;
  return acc;
}, {});

export const idToIcon = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.icon;
  return acc;
}, {});