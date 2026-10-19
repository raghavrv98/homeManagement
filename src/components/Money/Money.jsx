import React from "react";
import Header from "../Header/Header.jsx";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  LocalDrink,
  Storefront,
  Fastfood,
  Home,
  LocalGasStation,
  House,
  Wifi,
  FlashOn,
  Whatshot,
  AttachMoney,
  TrendingUp,
  Security,
  AccountBalance,
  Elderly,
  Hiking,
  Wallet,
  Apartment,
  Build,
  CreditCard,
} from "@mui/icons-material";

const categories = [
  {
    label: "Vegetables & Fruits",
    path: "vegetables-fruits",
    icon: <ShoppingCart sx={{ fontSize: 28 }} />,
    color: "#A8E6CF",
  },
  { label: "Milk", path: "milk", icon: <LocalDrink sx={{ fontSize: 28 }} />, color: "#FFD3B6" },
  {
    label: "Kirana Store",
    path: "kirana-store",
    icon: <Storefront sx={{ fontSize: 28 }} />,
    color: "#FFAAA5",
  },
  {
    label: "Fast Food",
    path: "fast-food",
    icon: <Fastfood sx={{ fontSize: 28 }} />,
    color: "#FF8C94",
  },
  { label: "HomeNeeds", path: "homeNeeds", icon: <Home sx={{ fontSize: 28 }} />, color: "#DCE775" },
  {
    label: "Petrol",
    path: "petrol",
    icon: <LocalGasStation sx={{ fontSize: 28 }} />,
    color: "#FFF176",
  },
  { label: "House Rent", path: "houseRent", icon: <House sx={{ fontSize: 28 }} />, color: "#AED581" },
  { label: "Wifi Bill", path: "wifiBill", icon: <Wifi sx={{ fontSize: 28 }} />, color: "#4FC3F7" },
  {
    label: "Electricity Bill",
    path: "electricityBill",
    icon: <FlashOn sx={{ fontSize: 28 }} />,
    color: "#FFB74D",
  },
  { label: "Gas Bill", path: "gasBill", icon: <Whatshot sx={{ fontSize: 28 }} />, color: "#E57373" },
  { label: "Income", path: "income", icon: <AttachMoney sx={{ fontSize: 28 }} />, color: "#81C784" },
  {
    label: "Investment",
    path: "investment",
    icon: <TrendingUp sx={{ fontSize: 28 }} />,
    color: "#64B5F6",
  },
  { label: "LIC", path: "lic", icon: <Security sx={{ fontSize: 28 }} />, color: "#9575CD" },
  {
    label: "HomeLoan",
    path: "homeLoan",
    icon: <AccountBalance sx={{ fontSize: 28 }} />,
    color: "#7986CB",
  },
  { label: "Parents", path: "parents", icon: <Elderly sx={{ fontSize: 28 }} />, color: "#F48FB1" },
  { label: "Outing", path: "outing", icon: <Hiking sx={{ fontSize: 28 }} />, color: "#4DB6AC" },
  {
    label: "Personal Expense",
    path: "personalExpense",
    icon: <Wallet sx={{ fontSize: 28 }} />,
    color: "#BA68C8",
  },
  {
    label: "Advitya Flat Cost",
    path: "advityaFlatCost",
    icon: <Apartment sx={{ fontSize: 28 }} />,
    color: "#90A4AE",
  },
  {
    label: "Mumbai Home Setup Cost",
    path: "mumbaiHomeSetupCost",
    icon: <Build sx={{ fontSize: 28 }} />,
    color: "#A1887F",
  },
  {
    label: "Cred Loan Repay",
    path: "credLoanRepay",
    icon: <CreditCard sx={{ fontSize: 28 }} />,
    color: "#FFD74D",
  },
  {
    label: "Mumbai Misc",
    path: "mumbaiMisc",
    icon: <Wallet sx={{ fontSize: 28 }} />,
    color: "#FFCC80",
  },
  {
    label: "Faridabad Misc",
    path: "faridabadMisc",
    icon: <Wallet sx={{ fontSize: 28 }} />,
    color: "#80DEEA",
  },
];

const Money = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header backLink="/dashboard" />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((item, index) => (
            <Link
              key={index}
              to={`./${item.path}`}
              className="h-28 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center p-3 text-slate-800 font-bold text-xs sm:text-sm text-center hover:scale-105 border border-black/5"
              style={{ backgroundColor: item.color }}
            >
              <div className="mb-1.5 opacity-90">{item.icon}</div>
              <span className="leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Money;
