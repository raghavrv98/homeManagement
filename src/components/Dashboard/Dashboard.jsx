import React from "react";
import Header from "../Header/Header.jsx";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  TableChart,
  AttachMoney,
  ArrowForward,
  AccountBalance,
  Person,
} from "@mui/icons-material";

const primarySuiteItems = [
  {
    title: "Dashboard & Analytics",
    subtitle:
      "Annual financial overview, monthly savings, and expense analytics",
    path: "/dashboardTab",
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    tag: "Analytics",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    tagBg: "bg-blue-50 text-blue-700",
    hoverBorder: "hover:border-blue-500",
    actionColor: "text-blue-600",
  },
  {
    title: "Data Tables",
    subtitle:
      "Detailed ledger records, search, filters, and categorized sheets",
    path: "/dataTables",
    icon: <TableChart sx={{ fontSize: 20 }} />,
    tag: "Ledger",
    iconBg: "bg-gradient-to-br from-sky-500 to-sky-700",
    tagBg: "bg-sky-50 text-sky-700",
    hoverBorder: "hover:border-sky-500",
    actionColor: "text-sky-600",
  },
  {
    title: "Expense & Income Forms",
    subtitle: "Submit daily expenses, bills, investments, and revenue entries",
    path: "/home/money",
    icon: <AttachMoney sx={{ fontSize: 20 }} />,
    tag: "Entry",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
    tagBg: "bg-amber-50 text-amber-700",
    hoverBorder: "hover:border-amber-500",
    actionColor: "text-amber-600",
  },
];

const amishaSuiteItems = [
  {
    title: "Amisha Dashboard",
    subtitle: "Dedicated monthly breakdowns, net balance, and expense tracking",
    path: "/amishaDashboardTab",
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    tag: "Analytics",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    tagBg: "bg-purple-50 text-purple-700",
    hoverBorder: "hover:border-purple-500",
    actionColor: "text-purple-600",
  },
  {
    title: "Amisha Data Tables",
    subtitle: "Dedicated transaction archives, spreadsheets, and audit records",
    path: "/amishaDataTables",
    icon: <TableChart sx={{ fontSize: 20 }} />,
    tag: "Ledger",
    iconBg: "bg-gradient-to-br from-pink-500 to-pink-700",
    tagBg: "bg-pink-50 text-pink-700",
    hoverBorder: "hover:border-pink-500",
    actionColor: "text-pink-600",
  },
  {
    title: "Amisha Forms",
    subtitle: "Record personal expenses, shopping, bills, and monthly deposits",
    path: "/home/amishaMoney",
    icon: <AttachMoney sx={{ fontSize: 20 }} />,
    tag: "Entry",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    tagBg: "bg-emerald-50 text-emerald-700",
    hoverBorder: "hover:border-emerald-500",
    actionColor: "text-emerald-600",
  },
];

const Dashboard = () => {
  const renderCard = (item, index) => (
    <Link
      key={index}
      to={item.path}
      className={`group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full ${item.hoverBorder}`}
    >
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <div
            className={`w-9 h-9 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
          >
            {item.icon}
          </div>
          <span
            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${item.tagBg}`}
          >
            {item.tag}
          </span>
        </div>

        <h3 className="font-extrabold text-slate-900 text-sm sm:text-[15px] mb-1 group-hover:text-slate-950">
          {item.title}
        </h3>
        <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed">
          {item.subtitle}
        </p>
      </div>

      <div
        className={`flex items-center gap-1 font-bold text-xs sm:text-[13px] mt-3 ${item.actionColor} group-hover:gap-2 transition-all`}
      >
        <span>Open Module</span>
        <ArrowForward sx={{ fontSize: 14 }} />
      </div>
    </Link>
  );

  return (
    <div className="bg-slate-50 flex flex-col overflow-hidden">
      <Header isShowBack={false} isShowLogout={true} backLink="/home" />

      {/* Main Single-View Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col justify-between gap-3 sm:gap-4 min-h-0">
        {/* Compact Hero Banner */}
        <div className="h-30 py-2.5 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-4 shadow-sm shrink-0">
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight">
              Financial Management Hub
            </h1>
            <p className="text-slate-400 text-xs sm:text-[13px] mt-0.5">
              Select a workspace module to view analytics, search transactions,
              or record financial logs.
            </p>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/10 text-blue-300 font-bold text-xs backdrop-blur-xs">
            All Workspaces
          </span>
        </div>

        {/* Section 1: Primary Financial Suite */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <AccountBalance sx={{ fontSize: 15 }} />
            </div>
            <h2 className="font-extrabold text-slate-900 text-sm sm:text-[15px]">
              Primary Financial Suite
            </h2>
            <span className="text-slate-500 text-xs hidden sm:inline">
              • Household, Mumbai & Faridabad accounts
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-h-0">
            {primarySuiteItems.map((item, index) => renderCard(item, index))}
          </div>
        </div>

        {/* Section 2: Amisha's Financial Suite */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Person sx={{ fontSize: 15 }} />
            </div>
            <h2 className="font-extrabold text-slate-900 text-sm sm:text-[15px]">
              Amisha's Financial Suite
            </h2>
            <span className="text-slate-500 text-xs hidden sm:inline">
              • Dedicated personal records & tracking
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-h-0">
            {amishaSuiteItems.map((item, index) => renderCard(item, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
