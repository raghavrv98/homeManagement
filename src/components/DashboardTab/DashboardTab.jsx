import React, { useEffect, useState } from "react";
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
    <>
      <Header
        isShowBack={true}
        title="Dashboard"
        isShowLogout={true}
        backLink="/dashboard"
      />
      {loading ? (
        <PageLoader />
      ) : (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
          {/* SECTION 1: Top Bar & 3 Balanced KPI Cards */}
          <div className="mb-8">
            {/* Header Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Financial Overview
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Summary of your income, expenses, and investments for{" "}
                  <strong className="text-slate-700">
                    {selectedYear === "All"
                      ? "all recorded years"
                      : `year ${selectedYear}`}
                  </strong>
                </p>
              </div>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="year-select-label">Year Filter</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year Filter"
                  onChange={handleYearChange}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#FFFFFF",
                    fontWeight: 600,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year === "All" ? "All Years" : year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* 3 Balanced Summary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {summaryData.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/90 shadow-xs bg-white flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all p-5"
                  style={{ borderTop: `4px solid ${item.color}` }}
                >
                  <div className="mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      {item.label}
                    </span>
                    <span
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 block"
                      style={{ color: item.color }}
                    >
                      {formatINRCurrency(item?.value)}
                    </span>
                  </div>

                  {item?.subCat && item?.subCat.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-100">
                      {item.subCat.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                        >
                          <span className="text-slate-500 font-semibold text-xs block truncate" title={sub.label}>
                            {sub.label}
                          </span>
                          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                            {formatINRCurrency(sub.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="my-6 border-t border-slate-200" />

          {/* SECTION 2: Monthly Breakdown Header */}
          {selectedMonthIndex === null && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Monthly Breakdown
              </h2>
              <p className="text-sm text-slate-500">
                Click <strong className="text-slate-700">View Details</strong> on any month to inspect individual transaction categories
              </p>
            </div>
          )}

          {/* Monthly Cards (6 Columns in a Row on Desktop) */}
          {selectedMonthIndex === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {apiData?.map((month, index) => {
                const calcs = getMonthlyCalculations(month);

                return (
                  <div
                    key={index}
                    className={`rounded-xl border transition-all duration-200 flex flex-col justify-between p-3.5 ${
                      calcs.hasData
                        ? "border-slate-200/90 bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5"
                        : "border-slate-100 bg-slate-50/70 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div>
                      {/* Month Title & Net Savings Badge */}
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {month?.month}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
                            !calcs.hasData
                              ? "bg-slate-100 text-slate-500"
                              : calcs.profit >= 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {!calcs.hasData
                            ? "Inactive"
                            : `${calcs.profit >= 0 ? "+" : ""}${formatINRCurrency(calcs.profit)}`}
                        </span>
                      </div>

                      {/* Primary Metrics: Income vs Expense Side-by-Side */}
                      <div className="grid grid-cols-2 gap-2 mb-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="min-w-0">
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            Income
                          </span>
                          <span
                            className="font-bold text-blue-600 text-[13px] block truncate"
                            title={formatINRCurrency(calcs.income)}
                          >
                            {formatINRCurrency(calcs.income)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            Expense
                          </span>
                          <span
                            className="font-bold text-rose-600 text-[13px] block truncate"
                            title={formatINRCurrency(calcs.expense)}
                          >
                            {formatINRCurrency(calcs.expense)}
                          </span>
                        </div>
                      </div>

                      {/* Secondary Breakdown Rows */}
                      <div className="flex flex-col gap-1.5 mb-3">
                        <div className="flex justify-between items-center px-2 py-1 bg-slate-50 rounded-lg text-xs">
                          <span className="font-medium text-slate-600">Mumbai</span>
                          <span className="font-bold text-purple-700">
                            {formatINRCurrency(calcs.mumbaiTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center px-2 py-1 bg-slate-50 rounded-lg text-xs">
                          <span className="font-medium text-slate-600">Faridabad</span>
                          <span className="font-bold text-teal-700">
                            {formatINRCurrency(calcs.faridabadTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center px-2 py-1 bg-slate-50 rounded-lg text-xs">
                          <span className="font-medium text-slate-600">Investment</span>
                          <span className="font-bold text-amber-600">
                            {formatINRCurrency(calcs.investment)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full py-1 text-xs rounded-lg font-bold text-blue-600 bg-slate-50 hover:bg-blue-50 border border-blue-200 hover:border-blue-400 transition-all cursor-pointer mt-1"
                      onClick={() => handleViewDetails(index)}
                    >
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Top Navigation & Month Header */}
              {(() => {
                const monthCalcs = getMonthlyCalculations(
                  apiData[selectedMonthIndex],
                );
                const monthName = months[selectedMonthIndex];

                return (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={handleBackToAll}
                          className="px-3 py-1.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-xs"
                        >
                          ← Back to All Months
                        </button>
                        <div className="hidden sm:block w-px h-6 bg-slate-200" />
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {monthName} {selectedYear !== "All" ? selectedYear : ""} Breakdown
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Detailed breakdown of all income, expenditures, and investments
                          </p>
                        </div>
                      </div>

                      {/* Net Status Badge */}
                      <div
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                          monthCalcs.profit >= 0
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-rose-50 border-rose-200 text-rose-800"
                        }`}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Net Result:
                        </span>
                        <span className="text-sm font-extrabold">
                          {monthCalcs.profit >= 0 ? "+" : ""}
                          {formatINRCurrency(monthCalcs.profit)}
                        </span>
                      </div>
                    </div>

                    {/* Month KPI Summary Cards (6 in a clean horizontal grid) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                      {monthDetails.map((item, index) => {
                        const val = getMonthlyValueHandler(
                          apiData[selectedMonthIndex],
                          item.label,
                        );
                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-slate-200 shadow-xs bg-white p-3.5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all"
                            style={{ borderTop: `4px solid ${item.color}` }}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate" title={item.label}>
                              {item.label}
                            </span>
                            <span
                              className="text-lg sm:text-xl font-extrabold tracking-tight mt-1 block"
                              style={{ color: item.color }}
                            >
                              {val}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expense, Income & Investment Sections */}
                    <div className="flex flex-col gap-5">
                      {expenseSections.map((section, sIndex) => {
                        let sectionTotal = null;
                        if (section.title === "Mumbai Expense") {
                          sectionTotal = monthCalcs.mumbaiTotal;
                        } else if (section.title === "Faridabad Expense") {
                          sectionTotal = monthCalcs.faridabadTotal;
                        }

                        return (
                          <div
                            key={sIndex}
                            className="rounded-2xl border border-slate-200 bg-white shadow-xs p-4 sm:p-5"
                          >
                            {/* Section Header */}
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    backgroundColor:
                                      section.title === "Mumbai Expense"
                                        ? "#6A1B9A"
                                        : section.title === "Faridabad Expense"
                                        ? "#00897B"
                                        : "#2E7D32",
                                  }}
                                />
                                <h3 className="font-extrabold text-slate-800 text-base">
                                  {section.title}
                                </h3>
                              </div>

                              {sectionTotal !== null && (
                                <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-1.5">
                                  <span className="text-slate-500 font-semibold text-xs">
                                    Total:
                                  </span>
                                  <span
                                    className="font-extrabold text-sm"
                                    style={{
                                      color:
                                        section.title === "Mumbai Expense"
                                          ? "#6A1B9A"
                                          : "#00897B",
                                    }}
                                  >
                                    {formatINRCurrency(sectionTotal)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Section Items Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                              {section.categories.map((item, index) => {
                                const value =
                                  apiData[selectedMonthIndex]?.[item.label] ??
                                  0;
                                const isZero = value === 0;

                                return (
                                  <div
                                    key={index}
                                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-150 ${
                                      isZero
                                        ? "bg-slate-50/70 border-slate-100"
                                        : "bg-white border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5"
                                    }`}
                                    style={{
                                      borderLeftWidth: "4px",
                                      borderLeftColor: isZero ? "#CBD5E1" : item.color,
                                    }}
                                  >
                                    <span
                                      className={`text-xs font-semibold block truncate mb-1.5 ${
                                        isZero ? "text-slate-400" : "text-slate-600"
                                      }`}
                                      title={item.label}
                                    >
                                      {item.label}
                                    </span>
                                    <span
                                      className="font-extrabold text-sm"
                                      style={{ color: isZero ? "#94A3B8" : item.color }}
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
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DashboardTab;
