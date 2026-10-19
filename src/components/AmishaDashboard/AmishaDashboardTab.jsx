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
          {/* SECTION 1: Year Dropdown and Totals */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Amisha Financial Overview
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Summary of repayments, gifts, and income records
                </p>
              </div>

              {/* Year Dropdown */}
              <div className="w-full sm:w-48">
                <FormControl size="small" fullWidth>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    value={selectedYear}
                    label="Year"
                    onChange={handleYearChange}
                    sx={{
                      borderRadius: 2,
                      bgcolor: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {summaryData.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 shadow-xs bg-white p-4 flex flex-col justify-between hover:shadow-md transition-all"
                  style={{ borderTop: `4px solid ${item.color}` }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    {item.label}
                  </span>
                  <span
                    className="text-2xl font-extrabold tracking-tight mt-1 block"
                    style={{ color: item.color }}
                  >
                    {formatINRCurrency(item?.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="my-6 border-t border-slate-200" />

          {/* SECTION 2: Monthly Cards (6 in a row) */}
          <div className="mb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight mb-4">
              Monthly Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {apiData?.map((month, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200/90 bg-white shadow-xs p-3.5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-2.5">
                      {month?.month}
                    </h3>

                    <div className="flex flex-col gap-1.5">
                      {monthDetails.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center px-2 py-1 bg-slate-50 rounded-lg text-xs"
                        >
                          <span className="text-slate-500 font-medium truncate mr-1">
                            {item.label}
                          </span>
                          <span
                            className="font-bold whitespace-nowrap"
                            style={{ color: item.color }}
                          >
                            {getMonthlyValueHandler(month, item.label)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AmishaDashboardTab;
