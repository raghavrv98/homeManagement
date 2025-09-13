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
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
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
    { label: "Faridabad Home Expenses", value: 0, color: "#00897B" },
  ];

  const categories = [
    { label: "Vegetable and Fruits", value: 0, color: "#1E88E5" },
    { label: "Milk", value: 0, color: "#E53935" },
    { label: "Kirana Store", value: 0, color: "#FBC02D" },
    { label: "Fast Food", value: 0, color: "#43A047" },
    { label: "Homeneeds", value: 0, color: "#8E24AA" },
    { label: "Petrol", value: 0, color: "#FB8C00" },
    { label: "Outing", value: 0, color: "#3949AB" },
    { label: "House Rent", value: 0, color: "#D81B60" },
    { label: "Wifi Bill", value: 0, color: "#00ACC1" },
    { label: "Electricity Bill", value: 0, color: "#4CAF50" },
    { label: "Gas Bill", value: 0, color: "#6D4C41" },
    { label: "Home Loan", value: 0, color: "#C62828" },
    { label: "Income", value: 0, color: "#2E7D32" },
    { label: "Investment", value: 0, color: "#FFD600" },
    { label: "LIC", value: 0, color: "#1565C0" },
    { label: "Parents", value: 0, color: "#AD1457" },
    { label: "Personal Expense", value: 0, color: "#6A1B9A" },
    { label: "Advitya Flat Cost", value: 0, color: "#1E1081" },
    { label: "Mumbai Home Setup Cost", value: 0, color: "#5E1081" },
    { label: "Cred Loan Repay", value: 0, color: "#5A5081" },
  ];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);

  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleViewDetails = (index) => setSelectedMonthIndex(index);
  const handleBackToAll = () => setSelectedMonthIndex(null);
  const [apiData, setApiData] = useState([]);
  const [apiError, setApiError] = useState("");
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
      };

      for (const [label, { key, field }] of Object.entries(categoriesConfig)) {
        const entries = money[key] || [];

        entries.forEach((item) => {
          const date = new Date(item.timestamp);
          const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
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
      setApiError("An error occurred: " + error.message);
      setLoading(false);
    }
  };

  // Main function to generate summary
  const getSummaryData = (data) => {
    const totalIncome = data.reduce((sum, m) => sum + (m?.Income || 0), 0);
    const totalInvestment = data.reduce(
      (sum, m) => sum + (m?.Investment || 0),
      0
    );

    const totalExpense =
      data.reduce((sum, month) => sum + Math.abs(month.totalExpense), 0) -
      (totalIncome + totalInvestment);

    const totalProfit = totalIncome - (totalExpense + totalInvestment);

    return [
      {
        label: "Total Income",
        value: totalIncome,
        color: "#1E88E5",
      },
      {
        label: "Total Expense",
        value: totalExpense,
        color: "#E53935",
      },
      {
        label: "Total Investment",
        value: totalInvestment,
        color: "#FBC02D",
      },
      {
        label: "Total Cash",
        value: totalProfit,
        color: "#43A047",
      },
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
      (month?.["Mumbai Home Setup Cost"] || 0);

    const faridabadTotal =
      (month?.["Advitya Flat Cost"] || 0) +
      (month?.["Home Loan"] || 0) +
      (month?.["Cred Loan Repay"] || 0) +
      (month?.LIC || 0) +
      (month?.Parents || 0);

    // Calculate expenses only (exclude income + investment)
    const expense = mumbaiTotal + faridabadTotal;
    const profit = income - expense;

    switch (label) {
      case "Total Income":
        return formatINRCurrency(income);
      case "Total Expense":
        return formatINRCurrency(expense);
      case "Total Investment":
        return formatINRCurrency(investment);
      case "Total Profit":
        return formatINRCurrency(profit);
      case "Mumbai Home Expenses":
        return formatINRCurrency(mumbaiTotal);
      case "Faridabad Home Expenses":
        return formatINRCurrency(faridabadTotal);
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
                flex={{ xs: "1 1 100%", md: "0 0 250px" }}
                minWidth={{ xs: "100%", md: "200px" }}
                maxWidth={{ xs: "100%", md: "300px" }}
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

          {/* SECTION 2: Monthly Cards or Detailed View */}
          {selectedMonthIndex === null ? (
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

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            color: "#1976D2",
                            borderColor: "#1976D2",
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#E3F2FD",
                              borderColor: "#0D47A1",
                              color: "#0D47A1",
                            },
                          }}
                          onClick={() => handleViewDetails(index)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBackToAll}
                sx={{ width: "fit-content" }}
              >
                ← Back to All Months
              </Button>

              <Card
                sx={{
                  bgcolor: "#F5F7FA",
                  boxShadow: 2,
                  border: "1px solid #E0E0E0",
                  width: "100%",
                  p: 3,
                }}
              >
                {/* Month Title */}
                <Typography
                  variant="h5"
                  sx={{ color: "#1976D2", fontWeight: "bold", mb: 3 }}
                >
                  {months[selectedMonthIndex]}
                </Typography>

                {/* FLEXBOX version of details section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    flexWrap: "wrap",
                  }}
                >
                  {/* LEFT: Label + Value Boxes */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* LEFT: Category Cards */}
                    <Box
                      sx={{
                        flex: { xs: "1 1 100%", md: "2 1 0%" },
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      {categories.map((item, index) => {
                        const value =
                          apiData[selectedMonthIndex]?.[item.label] ?? 0;
                        return (
                          <Box
                            key={index}
                            sx={{
                              flex: {
                                xs: "1 1 100%", // Full width on mobile
                                sm: "1 1 calc(50% - 16px)", // Two per row on tablets
                                md: "1 1 calc(33.33% - 16px)", // Three per row on medium screens
                                lg: "0 0 350px", // Fixed width on large screens
                              },
                              minWidth: {
                                xs: "100%",
                                sm: "250px",
                              },
                              bgcolor: "#fff",
                              p: 2,
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                bgcolor: "#F9FAFB",
                                px: 2,
                                py: 1.5,
                                borderRadius: 1,
                                border: "1px solid #E0E0E0",
                              }}
                            >
                              <Typography variant="body1">
                                {item.label}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold", color: item.color }}
                              >
                                ₹{value.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* RIGHT: Summary Cards */}
                    <Box
                      sx={{
                        flex: { xs: "1 1 100%", md: "1 1 300px" },
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "250px" },
                        gap: 2,
                      }}
                    >
                      {monthDetails.map((item, index) => (
                        <Card
                          key={index}
                          sx={{
                            bgcolor: "#fff",
                            boxShadow: 1,
                            borderLeft: `6px solid ${item.color}`,
                            px: 2,
                            py: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: item.color }}
                          >
                            {getMonthlyValueHandler(
                              apiData[selectedMonthIndex],
                              item.label
                            )}
                          </Typography>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default DashboardTab;
