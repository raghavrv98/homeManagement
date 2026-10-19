import React from "react";
import Header from "../Header/Header.jsx";
import { Link } from "react-router-dom";
import {
  AttachMoney,
  TrendingUp,
  Wallet,
  Redeem,
  Replay,
} from "@mui/icons-material";

const categories = [
  {
    label: "Income",
    path: "amishaIncome",
    icon: <AttachMoney sx={{ fontSize: 28 }} />,
    color: "#81C784",
  },
  {
    label: "Investment",
    path: "amishaInvestment",
    icon: <TrendingUp sx={{ fontSize: 28 }} />,
    color: "#64B5F6",
  },
  {
    label: "Monthly Expense",
    path: "amishaMonthlyExpense",
    icon: <Wallet sx={{ fontSize: 28 }} />,
    color: "#FFD54F",
  },
  {
    label: "Expenses",
    path: "amishaExpenses",
    icon: <Wallet sx={{ fontSize: 28 }} />,
    color: "#BA68C8",
  },
  {
    label: "Repay",
    path: "amishaRepay",
    icon: <Replay sx={{ fontSize: 28 }} />,
    color: "#FFB74D",
  },
  {
    label: "Gift Cost",
    path: "amishaGiftCost",
    icon: <Redeem sx={{ fontSize: 28 }} />,
    color: "#E57373",
  },
];

const AmishaMoney = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header backLink="/dashboard" />
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((item, index) => (
            <Link
              key={index}
              to={`./${item.path}`}
              className="h-28 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center p-4 text-slate-800 font-bold text-sm sm:text-base text-center hover:scale-105 border border-black/5"
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

export default AmishaMoney;
