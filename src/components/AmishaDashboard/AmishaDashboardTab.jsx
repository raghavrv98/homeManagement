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

const AmishaDashboardTab = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Monthly labels shown in cards
  const monthDetails = [
    { label: "Total Income", value: 0, color: "#1976D2" },
    { label: "Total Expenses", value: 0, color: "#D32F2F" },
    { label: "Total Investment", value: 0, color: "#FFC107" },
    { label: "Total Repay", value: 0, color: "#8E24AA" },
    { label: "Total Gift Cost", value: 0, color: "#F06292" },
    { label: "Total Cash", value: 0, color: "#2E7D32" },
  ];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const handleYearChange = (event) => setSelectedYear(event.target.value);

  const [apiData, setApiData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [apiError, setApiError] = useState("");
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

      if (!response.ok) throw new Error(result.msg || "Failed to fetch data");

      const money = result.data[0]?.money || {};
      const monthMap = {}; // Temporarily hold unsorted monthly data

      // Define categories to calculate
      const categoriesConfig = {
        Income: { key: "amishaIncome", field: "cost" },
        Investment: { key: "amishaInvestment", field: "cost" },
        Expenses: { key: "amishaExpenses", field: "cost" },
        Repay: { key: "amishaRepay", field: "cost" },
        GiftCost: { key: "amishaGiftCost", field: "cost" },
      };

      for (const [label, { key, field }] of Object.entries(categoriesConfig)) {
        const entries = money[key] || [];
        entries.forEach((item) => {
          const date = new Date(item.timestamp);
          const monthIndex = date.getMonth();
          const monthName = date.toLocaleString("default", { month: "long" });

          if (!monthMap[monthIndex]) {
            monthMap[monthIndex] = {
              Income: 0,
              Investment: 0,
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
      setApiError("An error occurred: " + error.message);
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
    const totalRepay = data.reduce((sum, m) => sum + (m?.Repay || 0), 0);
    const totalGiftCost = data.reduce((sum, m) => sum + (m?.GiftCost || 0), 0);

    const totalCash = totalIncome - (totalInvestment + totalExpenses);
    const totalBalanceLeft = totalIncome - (totalRepay + totalInvestment + totalCash);

    return [
      {
        label: "Total Balance Left",
        value: totalBalanceLeft,
        color: "#F06292",
      },
      { label: "Total Income", value: totalIncome, color: "#1E88E5" },
      { label: "Total Expenses", value: totalExpenses, color: "#E53935" },
      { label: "Total Investment", value: totalInvestment, color: "#FBC02D" },
      { label: "Total Repay", value: totalRepay, color: "#8E24AA" },
      { label: "Total Gift Cost", value: totalGiftCost, color: "#F06292" },
      { label: "Total Cash", value: totalCash, color: "#43A047" },
    ];
  };

  useEffect(() => {
    const summaryData = getSummaryData(apiData);
    setSummaryData(summaryData);
  }, [apiData]);

  useEffect(() => {
    fetchData();
  }, []);

  const getMonthlyValueHandler = (month, label) => {
    const Income = month?.Income || 0;
    const Investment = month?.Investment || 0;
    const Expenses = month?.Expenses || 0;
    const Repay = month?.Repay || 0;
    const GiftCost = month?.GiftCost || 0;

    switch (label) {
      case "Total Income":
        return formatINRCurrency(Income);
      case "Total Expenses":
        return formatINRCurrency(Expenses);
      case "Total Investment":
        return formatINRCurrency(Investment);
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
        <Box p={3}>
          {/* SECTION 1: Year Dropdown and Totals */}
          <Box mb={4}>
            <Box
              display="flex"
              flexWrap={{ xs: "wrap", md: "nowrap" }}
              gap={2}
              justifyContent="space-between"
              alignItems="flex-start"
            >
              {/* Year Dropdown */}
              <Box
                flex={{ xs: "1 1 100%", md: "0 0 100px" }}
                minWidth={{ xs: "100%", md: "100px" }}
                maxWidth={{ xs: "100%", md: "100px" }}
              >
                <FormControl fullWidth>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    value={selectedYear}
                    label="Year"
                    onChange={handleYearChange}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Summary Cards */}
              <Box
                display="flex"
                flex="1 1 auto"
                flexWrap={{ xs: "wrap", sm: "nowrap" }}
                justifyContent="flex-end"
                gap={2}
                overflowX="auto"
                minWidth={0}
              >
                {summaryData.map((item, index) => (
                  <Box
                    key={index}
                    flex="0 0 auto"
                    minWidth={{ xs: "100%", sm: "200px" }}
                  >
                    <Card
                      sx={{
                        bgcolor: "#f5f5f5",
                        boxShadow: 1,
                        color: item.color,
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">
                          {item.label}
                        </Typography>
                        <Typography variant="h5">
                          {formatINRCurrency(item?.value)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* SECTION 2: Monthly Cards */}
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            gap={2}
          >
            {apiData?.map((month, index) => (
              <Box
                key={index}
                flex={{
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "1 1 calc(33.33% - 16px)",
                  lg: "1 1 calc(16.66% - 16px)",
                }}
                minWidth="150px"
                display="flex"
              >
                <Card
                  sx={{
                    bgcolor: "#F5F7FA",
                    boxShadow: 2,
                    border: "1px solid #E0E0E0",
                    width: "100%",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ color: "#1976D2", fontWeight: "bold", mb: 2 }}
                    >
                      {month?.month}
                    </Typography>

                    {monthDetails.map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                          bgcolor: "#ffffff",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: item.color }}
                        >
                          {getMonthlyValueHandler(month, item.label)}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default AmishaDashboardTab;
