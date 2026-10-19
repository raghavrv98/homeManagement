import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Button,
} from "@mui/material";
import Header from "../Header/Header";
import { API_URL } from "../../constant.js";
import PageLoader from "../PageLoader.jsx";

const DashboardTab = () => {
  const currentYear = new Date().getFullYear();
  const years = ["All", "2025", "2026"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthDetails = [
    { label: "Total Income", value: 0, color: "#1976D2" },
    { label: "Total Expense", value: 0, color: "#D32F2F" },
    { label: "Total Investment", value: 0, color: "#FFC107" },
    { label: "Total Profit", value: 0, color: "#2E7D32" },
    { label: "Mumbai Home Expenses", value: 0, color: "#6A1B9A" },
    {
      label: "Faridabad Home Expenses",
      value: 0,
      color: "#00897B",
    },
  ];

  const expenseSections = [
    {
      title: "Mumbai Expense",
      categories: [
        { label: "Vegetable and Fruits", color: "#1E88E5" },
        { label: "Milk", color: "#E53935" },
        { label: "Kirana Store", color: "#FBC02D" },
        { label: "Fast Food", color: "#43A047" },
        { label: "Homeneeds", color: "#8E24AA" },
        { label: "Petrol", color: "#FB8C00" },
        { label: "Outing", color: "#3949AB" },
        { label: "House Rent", color: "#D81B60" },
        { label: "Wifi Bill", color: "#00ACC1" },
        { label: "Electricity Bill", color: "#4CAF50" },
        { label: "Gas Bill", color: "#6D4C41" },
        { label: "Personal Expense", color: "#6A1B9A" },
        { label: "Mumbai Misc", color: "#0288D1" },
        { label: "Mumbai Home Setup Cost", color: "#5E1081" },
      ],
    },
    {
      title: "Faridabad Expense",
      categories: [
        { label: "Advitya Flat Cost", color: "#1E1081" },
        { label: "Home Loan", color: "#C62828" },
        { label: "Cred Loan Repay", color: "#5A5081" },
        { label: "LIC", color: "#1565C0" },
        { label: "Parents", color: "#AD1457" },
        { label: "Faridabad Misc", color: "#7CB342" },
      ],
    },
    {
      title: "Income & Investment",
      categories: [
        { label: "Income", color: "#2E7D32" },
        { label: "Investment", color: "#FFD600" },
      ],
    },
  ];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [rawData, setRawData] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);

  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleViewDetails = (index) => setSelectedMonthIndex(index);
  const handleBackToAll = () => setSelectedMonthIndex(null);

  const navigate = useNavigate();

  const handleNavigateToDataTable = (
    categoryLabel,
    monthIdx = selectedMonthIndex
  ) => {
    const year =
      selectedYear === "All"
        ? new Date().getFullYear()
        : parseInt(selectedYear, 10);
    const month = monthIdx !== null ? monthIdx : new Date().getMonth();

    const start = dayjs(new Date(year, month, 1))
      .startOf("month")
      .format("YYYY-MM-DD");
    const end = dayjs(new Date(year, month, 1))
      .endOf("month")
      .format("YYYY-MM-DD");

    navigate(
      `/dataTables?category=${encodeURIComponent(
        categoryLabel
      )}&startDate=${start}&endDate=${end}`,
      {
        state: {
          category: categoryLabel,
          startDate: start,
          endDate: end,
          from: "/dashboardTab",
        },
      }
    );
  };
  const [apiData, setApiData] = useState([]);
  // const [apiError, setApiError] = useState("");
  const [summaryData, setSummaryData] = useState([]);

  const [loading, setLoading] = useState(true);

  const formatINRCurrency = (value) => {
    const number = Number(value);

    if (isNaN(number)) return "₹0";

    return number.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/raghav`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || "Failed to fetch data");
      }

      const money = result.data[0]?.money || {};
      setRawData(money);

      const monthMap = {}; // Temporarily hold unsorted monthly data

      const categoriesConfig = {
        "Vegetable and Fruits": {
          key: "vegetablesFruits",
          field: "costWePaid",
        },
        Milk: { key: "milk", field: "costWePaid" },
        "Kirana Store": { key: "kiranaStore", field: "cost" },
        "Fast Food": { key: "fastFood", field: "cost" },
        Homeneeds: { key: "homeNeeds", field: "cost" },
        Petrol: { key: "petrol", field: "cost" },
        Outing: { key: "outing", field: "cost" },
        "House Rent": { key: "houseRent", field: "amount" },
        "Wifi Bill": { key: "wifi", field: "amount" },
        "Electricity Bill": { key: "electricity", field: "amount" },
        "Gas Bill": { key: "gas", field: "amount" },
        "Home Loan": { key: "homeloan", field: "cost" },
        Income: { key: "income", field: "cost" },
        Investment: { key: "investment", field: "cost" },
        LIC: { key: "lic", field: "cost" },
        Parents: { key: "parents", field: "cost" },
        "Personal Expense": { key: "personalExpense", field: "cost" },
        "Advitya Flat Cost": { key: "advityaFlatCost", field: "cost" },
        "Cred Loan Repay": { key: "credLoanRepay", field: "cost" },
        "Mumbai Home Setup Cost": {
          key: "mumbaiHomeSetupCost",
          field: "cost",
        },
        "Mumbai Misc": { key: "mumbaiMisc", field: "cost" },
        "Faridabad Misc": { key: "faridabadMisc", field: "cost" },
      };

      for (const [label, { key, field }] of Object.entries(categoriesConfig)) {
        const entries = money[key] || [];

        entries.forEach((item) => {
          const date = new Date(item.timestamp);
          const year = date.getFullYear();

          // 🔴 FILTER BY SELECTED YEAR
          if (selectedYear !== "All" && year !== Number(selectedYear)) return;

          const monthIndex = date.getMonth();
          const monthName = date.toLocaleString("default", { month: "long" });

          if (!monthMap[monthIndex]) {
            monthMap[monthIndex] = {
              month: monthName,
              "Vegetable and Fruits": 0,
              Milk: 0,
              "Kirana Store": 0,
              "Fast Food": 0,
              Homeneeds: 0,
              Petrol: 0,
              Outing: 0,
              "House Rent": 0,
              "Wifi Bill": 0,
              "Electricity Bill": 0,
              "Gas Bill": 0,
              "Home Loan": 0,
              Income: 0,
              Investment: 0,
              LIC: 0,
              Parents: 0,
              "Personal Expense": 0,
              "Advitya Flat Cost": 0,
              "Cred Loan Repay": 0,
              "Mumbai Home Setup Cost": 0,
              "Mumbai Misc": 0,
              "Faridabad Misc": 0,
            };
          }

          const value = parseFloat(item[field]) || 0;
          monthMap[monthIndex][label] += value;
        });
      }

      // Convert monthMap to sorted array and calculate totalExpense
      const sortedMonths = Array.from({ length: 12 }, (_, i) => {
        const entry = monthMap[i] || {
          month: new Date(2000, i).toLocaleString("default", { month: "long" }),
          "Vegetable and Fruits": 0,
          Milk: 0,
          "Kirana Store": 0,
          "Fast Food": 0,
          Homeneeds: 0,
          Petrol: 0,
          Outing: 0,
          "House Rent": 0,
          "Wifi Bill": 0,
          "Electricity Bill": 0,
          "Gas Bill": 0,
          "Personal Expense": 0,
          "Advitya Flat Cost": 0,
          "Cred Loan Repay": 0,
          "Mumbai Home Setup Cost": 0,
          "Mumbai Misc": 0,
          "Faridabad Misc": 0,
        };

        const totalExpense = Object.entries(entry)
          .filter(([key]) => key !== "month")
          .reduce((sum, [, val]) => sum + val, 0);

        return { ...entry, totalExpense };
      });

      setApiData(sortedMonths);
      setLoading(false);
    } catch (error) {
      alert(error.message);
      // setApiError("An error occurred: " + error.message);
      setLoading(false);
    }
  };

  // 🔹 Year filter helper
  const isSameYear = (timestamp) =>
    selectedYear === "All" ||
    new Date(timestamp).getFullYear() === Number(selectedYear);

  // 🔹 Filter rawData by selected year
  const yearlyIncome = rawData?.income?.filter((i) => isSameYear(i.timestamp));

  const yearlyInvestment = rawData?.investment?.filter((i) =>
    isSameYear(i.timestamp),
  );

  // Main function to generate summary
  const getSummaryData = (data) => {
    const totalIncome = data.reduce((sum, m) => sum + (m?.Income || 0), 0);

    const totalJobAmount = yearlyIncome?.reduce((sum, m) => {
      if (m.source === "job") {
        return sum + (m?.cost || 0);
      }
      return sum;
    }, 0);

    const totalInvestment = data.reduce(
      (sum, m) => sum + (m?.Investment || 0),
      0,
    );

    const totalExpense =
      data.reduce((sum, month) => sum + Math.abs(month.totalExpense), 0) -
      (totalIncome + totalInvestment);

    const totalRdAmount = yearlyInvestment?.reduce((sum, m) => {
      if (m.type === "RD") {
        return sum + (m?.cost || 0);
      }
      return sum;
    }, 0);

    const totalStocksAmount = yearlyInvestment?.reduce((sum, m) => {
      if (m.type === "Stocks") {
        return sum + (m?.cost || 0);
      }
      return sum;
    }, 0);
    console.log("totalStocksAmount: ", totalStocksAmount);

    const totalMutualFundAmount = yearlyInvestment?.reduce((sum, m) => {
      if (m.type === "Mutual Fund") {
        return sum + (m?.cost || 0);
      }
      return sum;
    }, 0);

    const totalFaridabadAmount = yearlyInvestment?.reduce((sum, m) => {
      if (m.type === "Faridabad") {
        return sum + (m?.cost || 0);
      }
      return sum;
    }, 0);

    // const totalCash = totalIncome - (totalExpense + totalInvestment + totalRdAmount);

    const totalMumbaiExpense = apiData?.reduce((sum, month) => {
      const mumbaiTotal =
        (month?.["Vegetable and Fruits"] || 0) +
        (month?.Milk || 0) +
        (month?.["Kirana Store"] || 0) +
        (month?.["Fast Food"] || 0) +
        (month?.Homeneeds || 0) +
        (month?.Petrol || 0) +
        (month?.Outing || 0) +
        (month?.["House Rent"] || 0) +
        (month?.["Wifi Bill"] || 0) +
        (month?.["Electricity Bill"] || 0) +
        (month?.["Gas Bill"] || 0) +
        (month?.["Personal Expense"] || 0) +
        (month?.["Mumbai Misc"] || 0) +
        (month?.["Mumbai Home Setup Cost"] || 0);
      return sum + mumbaiTotal;
    }, 0);

    const totalFaridabadExpense = apiData?.reduce((sum, month) => {
      const mumbaiTotal =
        (month?.["Advitya Flat Cost"] || 0) +
        (month?.["Home Loan"] || 0) +
        (month?.["Cred Loan Repay"] || 0) +
        (month?.LIC || 0) +
        (month?.Parents || 0) +
        (month?.["Faridabad Misc"] || 0);
      return sum + mumbaiTotal;
    }, 0);

    return [
      {
        label: "Total Income",
        value: totalIncome,
        color: "#1E88E5",
        type: "income",
        subCat: [
          { label: "Job", value: totalJobAmount },
          {
            label: "Other Income (If any)",
            value: totalIncome - totalJobAmount,
          },
        ],
      },
      {
        label: "Total Expense",
        value: totalExpense,
        color: "#E53935",
        subCat: [
          {
            label: "Total Mumbai Expense",
            value: totalMumbaiExpense?.toFixed(2),
          },
          {
            label: "Total Faridabad Expense",
            value: totalFaridabadExpense?.toFixed(2),
          },
        ],
      },
      {
        label: "Total Investment",
        value: totalInvestment,
        color: "#FBC02D",
        subCat: [
          {
            label: "Stocks",
            value: totalStocksAmount?.toFixed(2),
          },
          {
            label: "RD",
            value: totalRdAmount?.toFixed(2),
          },
          {
            label: "Mutual Fund",
            value: totalMutualFundAmount?.toFixed(2),
          },
          {
            label: "Faridabad",
            value: totalFaridabadAmount?.toFixed(2),
          },
        ],
      },
      // {
      //   label: "Total Cash",
      //   value: totalCash,
      //   color: "#43A047",
      // },
    ];
  };

  useEffect(() => {
    const summaryData = getSummaryData(apiData);
    setSummaryData(summaryData);
  }, [apiData]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [selectedYear]);

  const getMonthlyCalculations = (month) => {
    const income = month?.Income || 0;
    const investment = month?.Investment || 0;

    const mumbaiTotal =
      (month?.["Vegetable and Fruits"] || 0) +
      (month?.Milk || 0) +
      (month?.["Kirana Store"] || 0) +
      (month?.["Fast Food"] || 0) +
      (month?.Homeneeds || 0) +
      (month?.Petrol || 0) +
      (month?.Outing || 0) +
      (month?.["House Rent"] || 0) +
      (month?.["Wifi Bill"] || 0) +
      (month?.["Electricity Bill"] || 0) +
      (month?.["Gas Bill"] || 0) +
      (month?.["Personal Expense"] || 0) +
      (month?.["Mumbai Misc"] || 0) +
      (month?.["Mumbai Home Setup Cost"] || 0);

    const faridabadTotal =
      (month?.["Advitya Flat Cost"] || 0) +
      (month?.["Home Loan"] || 0) +
      (month?.["Cred Loan Repay"] || 0) +
      (month?.LIC || 0) +
      (month?.Parents || 0) +
      (month?.["Faridabad Misc"] || 0);

    const expense = mumbaiTotal + faridabadTotal;
    const profit = income - expense;
    const hasData = income !== 0 || expense !== 0 || investment !== 0;

    return {
      income,
      investment,
      mumbaiTotal,
      faridabadTotal,
      expense,
      profit,
      hasData,
    };
  };

  const getMonthlyValueHandler = (month, label) => {
    const calcs = getMonthlyCalculations(month);

    switch (label) {
      case "Total Income":
        return formatINRCurrency(calcs.income);
      case "Total Expense":
        return formatINRCurrency(calcs.expense);
      case "Total Investment":
        return formatINRCurrency(calcs.investment);
      case "Total Profit":
        return formatINRCurrency(calcs.profit);
      case "Mumbai Home Expenses":
        return formatINRCurrency(calcs.mumbaiTotal);
      case "Faridabad Home Expenses":
        return formatINRCurrency(calcs.faridabadTotal);
      default:
        return null;
    }
  };

  return (
    <div className="h-screen max-h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Header
        isShowBack={true}
        title="Dashboard"
        isShowLogout={true}
        backLink="/dashboard"
      />
      {loading ? (
        <PageLoader />
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4">
          {selectedMonthIndex === null ? (
            <div className="h-full flex flex-col lg:flex-row gap-4 items-stretch overflow-hidden">
              {/* LEFT SIDEBAR: Executive Financial Summary & Controls */}
              <aside className="w-full lg:w-[320px] xl:w-[350px] shrink-0 h-full flex flex-col justify-between gap-2.5 overflow-hidden">
                {/* Control Box: Title & Year Select */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Financial Overview
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      Annual
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    Financial metrics for{" "}
                    <strong className="text-slate-700">
                      {selectedYear === "All"
                        ? "all recorded years"
                        : `year ${selectedYear}`}
                    </strong>
                  </p>

                  {/* Year Pill Selector */}
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setSelectedYear(year)}
                        className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          selectedYear === year
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {year === "All" ? "All" : year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Net Annual Savings Card */}
                {(() => {
                  const inc = summaryData[0]?.value || 0;
                  const exp = summaryData[1]?.value || 0;
                  const profit = inc - exp;
                  const rate = inc > 0 ? ((profit / inc) * 100).toFixed(1) : 0;

                  return (
                    <div
                      className={`p-3.5 rounded-2xl border shadow-2xs transition-all flex-1 min-h-0 flex flex-col justify-between ${
                        profit >= 0
                          ? "bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 border-emerald-200"
                          : "bg-gradient-to-br from-rose-500/10 via-white to-amber-500/5 border-rose-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Net Annual Savings
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            profit >= 0
                              ? "bg-emerald-100/80 text-emerald-800"
                              : "bg-rose-100/80 text-rose-800"
                          }`}
                        >
                          {profit >= 0 ? `+${rate}% savings` : "Deficit"}
                        </span>
                      </div>
                      <div
                        className={`text-2xl sm:text-3xl font-black tracking-tight ${
                          profit >= 0 ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {profit >= 0 ? "+" : ""}
                        {formatINRCurrency(profit)}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Total net surplus after all expenditures
                      </p>
                    </div>
                  );
                })()}

                {/* Total Income Card */}
                {summaryData[0] && (
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 border-t-4 border-t-blue-600 shadow-2xs flex-1 min-h-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {summaryData[0].label}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">
                        {formatINRCurrency(summaryData[0].value)}
                      </div>
                    </div>
                    {summaryData[0].subCat && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        {summaryData[0].subCat.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex justify-between items-center text-xs py-1 px-2 rounded-lg bg-slate-50"
                          >
                            <span className="text-slate-600 font-medium truncate text-[11px]">
                              {sub.label}
                            </span>
                            <span className="font-bold text-slate-900 ml-2 text-xs">
                              {formatINRCurrency(sub.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Total Expense Card */}
                {summaryData[1] && (
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 border-t-4 border-t-rose-600 shadow-2xs flex-1 min-h-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {summaryData[1].label}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                        {formatINRCurrency(summaryData[1].value)}
                      </div>
                    </div>
                    {summaryData[1].subCat && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        {summaryData[1].subCat.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex justify-between items-center text-xs py-1 px-2 rounded-lg bg-slate-50"
                          >
                            <span className="text-slate-600 font-medium truncate text-[11px]">
                              {sub.label}
                            </span>
                            <span className="font-bold text-slate-900 ml-2 text-xs">
                              {formatINRCurrency(sub.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Total Investment Card */}
                {summaryData[2] && (
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 border-t-4 border-t-amber-500 shadow-2xs flex-[1.2] min-h-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {summaryData[2].label}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
                        {formatINRCurrency(summaryData[2].value)}
                      </div>
                    </div>
                    {summaryData[2].subCat && (
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
                        {summaryData[2].subCat.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-1.5 rounded-lg bg-slate-50 text-xs flex flex-col justify-between"
                          >
                            <span
                              className="text-[10px] font-semibold text-slate-500 truncate"
                              title={sub.label}
                            >
                              {sub.label}
                            </span>
                            <span className="font-bold text-slate-800 text-xs mt-0.5">
                              {formatINRCurrency(sub.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </aside>

              {/* RIGHT MAIN CONTENT: 4-Column x 3-Row Monthly Matrix */}
              <main className="flex-1 min-w-0 h-full flex flex-col justify-between gap-2.5 overflow-hidden">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      Monthly Breakdown
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select{" "}
                      <strong className="text-slate-700">View Details</strong>{" "}
                      on any month to inspect individual transaction categories
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
                    <span>12 Months Overview</span>
                  </div>
                </div>

                {/* Monthly Cards: 4 columns x 3 rows grid filling 100% height */}
                <div className="flex-1 min-h-0 grid grid-cols-2 xl:grid-cols-4 grid-rows-3 gap-2.5">
                  {apiData?.map((month, index) => {
                    const calcs = getMonthlyCalculations(month);
                    const expenseRatio =
                      calcs.income > 0
                        ? Math.min(
                            100,
                            Math.round((calcs.expense / calcs.income) * 100),
                          )
                        : 0;

                    return (
                      <div
                        key={index}
                        className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between p-3 ${
                          calcs.hasData
                            ? "border-slate-200/90 bg-white shadow-2xs hover:shadow-md"
                            : "border-slate-200/50 bg-slate-50/70 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div>
                          {/* Month Title & Net Savings Badge */}
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                              {month?.month}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${
                                !calcs.hasData
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : calcs.profit >= 0
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                                    : "bg-rose-50 text-rose-700 border-rose-200/70"
                              }`}
                            >
                              {!calcs.hasData
                                ? "Inactive"
                                : `${calcs.profit >= 0 ? "+" : ""}${formatINRCurrency(calcs.profit)}`}
                            </span>
                          </div>

                          {/* Primary Metrics: Income vs Expense Side-by-Side */}
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 mb-1.5">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="min-w-0">
                                <span className="text-[10px] font-semibold text-slate-500 block">
                                  Income
                                </span>
                                <span
                                  className="font-extrabold text-blue-600 text-xs sm:text-sm block truncate"
                                  title={formatINRCurrency(calcs.income)}
                                >
                                  {formatINRCurrency(calcs.income)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-semibold text-slate-500 block">
                                  Expense
                                </span>
                                <span
                                  className="font-extrabold text-rose-600 text-xs sm:text-sm block truncate"
                                  title={formatINRCurrency(calcs.expense)}
                                >
                                  {formatINRCurrency(calcs.expense)}
                                </span>
                              </div>
                            </div>

                            {/* Mini Expense-to-Income Ratio Bar */}
                            {calcs.hasData && calcs.income > 0 && (
                              <div className="mt-1.5 pt-1 border-t border-slate-200/60">
                                <div className="flex justify-between text-[9px] text-slate-400 font-semibold mb-0.5">
                                  <span>Spend ratio</span>
                                  <span>{expenseRatio}%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-200/70 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      expenseRatio > 90
                                        ? "bg-rose-500"
                                        : expenseRatio > 60
                                          ? "bg-amber-500"
                                          : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${expenseRatio}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Secondary Breakdown Rows */}
                          <div className="space-y-1 text-xs">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToDataTable("Total", index);
                              }}
                              title={`Click to view Mumbai expenses for ${month?.month} in Data Table`}
                              className="flex justify-between items-center px-1.5 py-0.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span className="font-medium text-slate-600 text-[11px]">
                                  Mumbai
                                </span>
                              </div>
                              <span className="font-bold text-slate-800 text-[11px]">
                                {formatINRCurrency(calcs.mumbaiTotal)}
                              </span>
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToDataTable("Total", index);
                              }}
                              title={`Click to view Faridabad expenses for ${month?.month} in Data Table`}
                              className="flex justify-between items-center px-1.5 py-0.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                <span className="font-medium text-slate-600 text-[11px]">
                                  Faridabad
                                </span>
                              </div>
                              <span className="font-bold text-slate-800 text-[11px]">
                                {formatINRCurrency(calcs.faridabadTotal)}
                              </span>
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToDataTable("investment", index);
                              }}
                              title={`Click to view Investment for ${month?.month} in Data Table`}
                              className="flex justify-between items-center px-1.5 py-0.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span className="font-medium text-slate-600 text-[11px]">
                                  Investment
                                </span>
                              </div>
                              <span className="font-bold text-slate-800 text-[11px]">
                                {formatINRCurrency(calcs.investment)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          className="w-full py-1.5 text-xs rounded-xl font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-600 hover:text-white border border-blue-200/80 hover:border-transparent transition-all cursor-pointer flex items-center justify-center gap-1 mt-1"
                          onClick={() => handleViewDetails(index)}
                        >
                          View Details →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </main>
            </div>
          ) : (
            <div className="h-full flex flex-col gap-3 overflow-hidden">
              {/* Top Navigation & Month Header */}
              {(() => {
                const monthCalcs = getMonthlyCalculations(
                  apiData[selectedMonthIndex],
                );
                const monthName = months[selectedMonthIndex];

                return (
                  <>
                    <div className="flex justify-between items-center bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleBackToAll}
                          className="px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                        >
                          ← Back to All Months
                        </button>
                        <div className="w-px h-5 bg-slate-200 hidden sm:block" />
                        <div>
                          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                            {monthName}{" "}
                            {selectedYear !== "All" ? selectedYear : ""}{" "}
                            Breakdown
                          </h2>
                          <p className="text-[11px] text-slate-500 hidden sm:block">
                            Detailed breakdown of all income, expenditures, and
                            investments
                          </p>
                        </div>
                      </div>

                      {/* Net Status Badge */}
                      <div
                        className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
                          monthCalcs.profit >= 0
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-rose-50 border-rose-200 text-rose-800"
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Net Result:
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold">
                          {monthCalcs.profit >= 0 ? "+" : ""}
                          {formatINRCurrency(monthCalcs.profit)}
                        </span>
                      </div>
                    </div>

                    {/* TWO-COLUMN SPLIT: TOTAL HEADING ON LEFT, EXPENSES ON RIGHT */}
                    <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3.5 items-stretch overflow-hidden">
                      {/* LEFT: TOTAL HEADING CARDS (6 Cards Stretched to 100% Height) */}
                      <aside className="w-full lg:w-[280px] xl:w-[320px] shrink-0 h-full flex flex-col justify-between gap-2 overflow-hidden">
                        {monthDetails.map((item, index) => {
                          const val = getMonthlyValueHandler(
                            apiData[selectedMonthIndex],
                            item.label,
                          );
                          return (
                            <div
                              key={index}
                              onClick={() => handleNavigateToDataTable(item.label)}
                              title={`Click to view ${item.label} in Data Table for ${monthName}`}
                              className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs px-4 py-2 flex flex-col justify-center border-l-6 transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
                              style={{ borderLeftColor: item.color }}
                            >
                              <div className="flex justify-between items-center">
                                <span
                                  className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate group-hover:text-slate-800 transition-colors"
                                  title={item.label}
                                >
                                  {item.label}
                                </span>
                                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  ↗
                                </span>
                              </div>
                              <span
                                className="text-lg sm:text-xl xl:text-2xl font-black tracking-tight mt-0.5 block"
                                style={{ color: item.color }}
                              >
                                {val}
                              </span>
                            </div>
                          );
                        })}
                      </aside>

                      {/* RIGHT: EXPENSES (3 Sections Stretched to 100% Height) */}
                      <main className="flex-1 min-w-0 h-full flex flex-col justify-between gap-3 overflow-hidden">
                        {expenseSections.map((section, sIndex) => {
                          let sectionTotal = null;
                          let flexClass = "flex-1";
                          let gridClass =
                            "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 grid-rows-1";

                          if (section.title === "Mumbai Expense") {
                            sectionTotal = monthCalcs.mumbaiTotal;
                            flexClass = "flex-[1.8]";
                            gridClass =
                              "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 grid-rows-2";
                          } else if (section.title === "Faridabad Expense") {
                            sectionTotal = monthCalcs.faridabadTotal;
                            flexClass = "flex-1";
                            gridClass =
                              "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 grid-rows-1";
                          } else {
                            flexClass = "flex-1";
                            gridClass = "grid-cols-2 grid-rows-1";
                          }

                          return (
                            <div
                              key={sIndex}
                              className={`${flexClass} min-h-0 rounded-2xl border border-slate-200/90 bg-white shadow-2xs p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden`}
                            >
                              {/* Section Header */}
                              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 shrink-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        section.title === "Mumbai Expense"
                                          ? "#6A1B9A"
                                          : section.title ===
                                              "Faridabad Expense"
                                            ? "#00897B"
                                            : "#2E7D32",
                                    }}
                                  />
                                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                                    {section.title}
                                  </h3>
                                </div>

                                {sectionTotal !== null && (
                                  <div
                                    onClick={() =>
                                      handleNavigateToDataTable(
                                        section.title === "Mumbai Expense"
                                          ? "Mumbai Misc"
                                          : "Faridabad Misc",
                                      )
                                    }
                                    title={`Click to view ${section.title} in Data Table`}
                                    className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors"
                                  >
                                    <span className="text-slate-500 font-semibold text-xs">
                                      Total:
                                    </span>
                                    <span
                                      className="font-extrabold text-xs sm:text-sm"
                                      style={{
                                        color:
                                          section.title === "Mumbai Expense"
                                            ? "#6A1B9A"
                                            : "#00897B",
                                      }}
                                    >
                                      {formatINRCurrency(sectionTotal)}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      ↗
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Section Items Grid */}
                              <div
                                className={`flex-1 min-h-0 grid ${gridClass} gap-2 sm:gap-2.5 items-stretch mt-2`}
                              >
                                {section.categories.map((item, index) => {
                                  const value =
                                    apiData[selectedMonthIndex]?.[item.label] ??
                                    0;
                                  const isZero = value === 0;

                                  return (
                                    <div
                                      key={index}
                                      onClick={() =>
                                        handleNavigateToDataTable(item.label)
                                      }
                                      title={`Click to view ${item.label} in Data Table for ${monthName} ${selectedYear !== "All" ? selectedYear : ""}`}
                                      className={`h-full flex flex-col justify-center px-3 py-2 rounded-xl border border-l-4 transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group ${
                                        isZero
                                          ? "bg-slate-50/70 border-slate-100 hover:bg-slate-100/80"
                                          : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
                                      }`}
                                      style={{
                                        borderLeftColor: isZero
                                          ? "#CBD5E1"
                                          : item.color,
                                      }}
                                    >
                                      <div className="flex justify-between items-center mb-1 leading-tight">
                                        <span
                                          className={`text-base font-semibold block truncate ${
                                            isZero
                                              ? "text-slate-400"
                                              : "text-slate-600 group-hover:text-slate-900"
                                          }`}
                                          title={item.label}
                                        >
                                          {item.label}
                                        </span>
                                        <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                          ↗
                                        </span>
                                      </div>
                                      <span
                                        className="font-extrabold text-xs sm:text-sm xl:text-xl"
                                        style={{
                                          color: isZero
                                            ? "#94A3B8"
                                            : item.color,
                                        }}
                                      >
                                        {formatINRCurrency(value)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </main>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardTab;
