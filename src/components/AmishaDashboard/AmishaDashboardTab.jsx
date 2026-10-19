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
} from "@mui/material";
import Header from "../Header/Header.jsx";
import { API_URL } from "../../constant.js";
import PageLoader from "../PageLoader.jsx";
import dayjs from "dayjs";

const AmishaDashboardTab = () => {
  const currentYear = new Date().getFullYear();
  const years = ["All", "2025", "2026"];

  // Monthly labels shown in cards
  const monthDetails = [
    { label: "Total Income", value: 0, color: "#1976D2" },
    { label: "Total Repay", value: 0, color: "#8E24AA" },
    { label: "Total Gift Cost", value: 0, color: "#F06292" },
    // { label: "Total Cash", value: 0, color: "#2E7D32" },
  ];

  const [selectedYear, setSelectedYear] = useState("All");
  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const [incomeEntries, setIncomeEntries] = useState([]);

  const [apiData, setApiData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  // const [apiError, setApiError] = useState("");
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

  const calculateInterest = (amount, timestamp) => {
    if (!amount || !timestamp) return 0;

    const entryDate = dayjs(timestamp);

    // 🔹 Interest should be calculated only till end of selected year
    const endOfYear = selectedYear === "All" ? dayjs() : dayjs(`${selectedYear}-12-31`);

    // If entry is after selected year, ignore
    if (selectedYear !== "All" && entryDate.year() !== Number(selectedYear)) return 0;

    const monthsPassed = endOfYear.diff(entryDate, "month");

    if (monthsPassed <= 0) return 0;

    return Math.round((amount * monthsPassed * 1) / 100);
  };
  const calculateInterestFromIncome = (incomeEntries = []) => {
    let totalInterest = 0;

    const interestList = incomeEntries.map((entry) => {
      const amount = Number(entry.cost) || 0;
      const timestamp = entry.timestamp;

      const interest = calculateInterest(amount, timestamp);

      totalInterest += interest;

      return {
        description: entry?.description || "No description",
        amount,
        monthsPassed: dayjs().diff(dayjs(timestamp), "month"),
        interest,
      };
    });

    return { totalInterest, interestList };
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/raghav`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.msg || "Failed to fetch data");

      const money = result.data[0]?.money || {};
      setIncomeEntries(money?.amishaIncome || []);
      const monthMap = {}; // Temporarily hold unsorted monthly data

      // Define categories to calculate
      const categoriesConfig = {
        Income: { key: "amishaIncome", field: "cost" },
        Investment: { key: "amishaInvestment", field: "cost" },
        MonthlyExpense: { key: "amishaMonthlyExpense", field: "cost" },
        Expenses: { key: "amishaExpenses", field: "cost" },
        Repay: { key: "amishaRepay", field: "cost" },
        GiftCost: { key: "amishaGiftCost", field: "cost" },
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
              Income: 0,
              Investment: 0,
              MonthlyExpense: 0,
              Expenses: 0,
              Repay: 0,
              GiftCost: 0,
              month: monthName,
            };
          }

          const value = parseFloat(item[field]) || 0;
          monthMap[monthIndex][label] += value;
        });
      }

      // Fill missing months
      const sortedMonths = Array.from({ length: 12 }, (_, i) => {
        const entry = monthMap[i] || {
          month: new Date(2000, i).toLocaleString("default", { month: "long" }),
          Income: 0,
          Investment: 0,
          MonthlyExpense: 0,
          Expenses: 0,
          Repay: 0,
          GiftCost: 0,
        };
        return { ...entry };
      });

      setApiData(sortedMonths);
      setLoading(false);
    } catch (error) {
      alert(error.message);
      // setApiError("An error occurred: " + error.message);
      setLoading(false);
    }
  };

  // Calculate totals
  const getSummaryData = (data) => {
    const totalIncome = data.reduce((sum, m) => sum + (m?.Income || 0), 0);
    const totalInvestment = data.reduce(
      (sum, m) => sum + (m?.Investment || 0),
      0
    );
    const totalExpenses = data.reduce((sum, m) => sum + (m?.Expenses || 0), 0);
    const totalMonthlyExpenses = data.reduce(
      (sum, m) => sum + (m?.MonthlyExpense || 0),
      0
    );
    const totalRepay = data.reduce((sum, m) => sum + (m?.Repay || 0), 0);
    const totalGiftCost = data.reduce((sum, m) => sum + (m?.GiftCost || 0), 0);

    // const totalCash = totalIncome - (totalInvestment + totalExpenses);
    // const totalBalanceLeft = totalIncome - totalRepay;

    // 🔹 Filter Amisha income by selected year
    // const yearlyIncomeEntries = incomeEntries?.filter(
    //   (entry) => selectedYear === "All" || dayjs(entry.timestamp).year() === Number(selectedYear)
    // );

    // const totalInterestTillNow =
    //   calculateInterestFromIncome(yearlyIncomeEntries);

    // const giftMoney = 185000;
    // const profitOnInvestment = 216801;
    // const totalInterestTillNowFinal = 21523;

    return [
      {
        label: "Total Loss (extra pay without income)",
        // value:
        //   totalBalanceLeft +
        //   totalInterestTillNowFinal +
        //   giftMoney +
        //   profitOnInvestment,
        value: totalRepay - totalIncome,
        color: "#F06292",
      },
      { label: "Total Repay", value: totalRepay, color: "#8E24AA" },
      { label: "Total Income", value: totalIncome, color: "#1E88E5" },
      { label: "Total Gift Cost", value: totalGiftCost, color: "#F06292" },
      // { label: "Total Cash", value: totalCash, color: "#43A047" },
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

  const getMonthlyValueHandler = (month, label) => {
    const Income = month?.Income || 0;
    const Investment = month?.Investment || 0;
    const MonthlyExpense = month?.MonthlyExpense || 0;
    const Expenses = month?.Expenses || 0;
    const Repay = month?.Repay || 0;
    const GiftCost = month?.GiftCost || 0;

    switch (label) {
      case "Total Income":
        return formatINRCurrency(Income);
      case "Total Repay":
        return formatINRCurrency(Repay);
      case "Total Gift Cost":
        return formatINRCurrency(GiftCost);
      case "Total Cash":
        return formatINRCurrency(
          Income - (Expenses + Investment + Repay + GiftCost)
        );
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
        <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-5">
          <div className="h-full flex flex-col lg:flex-row gap-5 items-stretch overflow-hidden">
            {/* LEFT SIDEBAR: Executive Summary & Year Filter */}
            <aside className="w-full lg:w-[320px] xl:w-[350px] shrink-0 h-full overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
              {/* Header & Year Pills */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Amisha Overview
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    Dedicated
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                  Summary of repayments, gifts, and personal income records for{" "}
                  <strong className="text-slate-700">year {selectedYear}</strong>
                </p>

                {/* Year Pill Selector */}
                <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setSelectedYear(year)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedYear === year
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stacked Summary Cards */}
              <div className="space-y-3">
                {summaryData.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200/90 shadow-xs bg-white p-4 flex flex-col justify-between hover:shadow-md transition-all border-l-4"
                    style={{ borderLeftColor: item.color }}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      {item.label}
                    </span>
                    <span
                      className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 block"
                      style={{ color: item.color }}
                    >
                      {formatINRCurrency(item?.value)}
                    </span>
                  </div>
                ))}
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT: 4-Column Monthly Matrix */}
            <main className="flex-1 min-w-0 h-full overflow-y-auto pr-1 scrollbar-thin">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Monthly Breakdown
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Monthly log of personal income, expenses, and repayment activities
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
                  <span>12 Months</span>
                </div>
              </div>

              {/* Monthly Cards: 4 columns on large screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {apiData?.map((month, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200/90 bg-white shadow-xs p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-extrabold text-slate-900 text-base">
                          {month?.month}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {selectedYear}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {monthDetails.map((item, i) => {
                          const val = getMonthlyValueHandler(month, item.label);
                          return (
                            <div
                              key={i}
                              className="flex justify-between items-center px-2 py-1.5 bg-slate-50 rounded-lg text-xs"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-slate-600 font-medium truncate mr-1">
                                  {item.label}
                                </span>
                              </div>
                              <span
                                className="font-bold whitespace-nowrap"
                                style={{ color: item.color }}
                              >
                                {val}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmishaDashboardTab;
