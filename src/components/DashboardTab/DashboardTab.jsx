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
import { useParentsInterest } from "./calculateParentsInterest.jsx";
import { useFaridabadIncome } from "./useFaridabadIncome.jsx";

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
    {
      label: "Faridabad Home Expenses",
      value: 0,
      color: "#00897B",
    },
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
    { label: "Mumbai Misc", value: 0, color: "#0288D1" },
    { label: "Faridabad Misc", value: 0, color: "#7CB342" },
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
  const { totalInterest } = useParentsInterest(apiData);
  const { totalFaridabadIncome, totalInterestOnAmountTaken } =
    useFaridabadIncome(rawData?.income);

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

  // Main function to generate summary
  const getSummaryData = (data) => {
    const totalIncome = data.reduce((sum, m) => sum + (m?.Income || 0), 0);

    const totalJobAmount = rawData?.income?.reduce((sum, m) => {
      if (m.source === "job") {
        sum = sum + (m?.cost || 0);
        return sum;
      }
      return sum;
    }, 0);

    const totalInvestment = data.reduce(
      (sum, m) => sum + (m?.Investment || 0),
      0
    );

    const totalExpense =
      data.reduce((sum, month) => sum + Math.abs(month.totalExpense), 0) -
      (totalIncome + totalInvestment);

    const totalRdAmount = rawData?.investment?.reduce((sum, m) => {
      if (m.type === "RD") {
        sum = sum + (m?.cost || 0);
        return sum;
      }
      return sum;
    }, 0);

    const totalStocksAmount = rawData?.investment?.reduce((sum, m) => {
      if (m.type === "Stocks") {
        sum = sum + (m?.cost || 0);
        return sum;
      }
      return sum;
    }, 0);

    const totalMutualFundAmount = rawData?.investment?.reduce((sum, m) => {
      if (m.type === "Mutual Fund") {
        sum = sum + (m?.cost || 0);
        return sum;
      }
      return sum;
    }, 0);

    const totalFaridabadAmount = rawData?.investment?.reduce((sum, m) => {
      if (m.type === "Faridabad") {
        sum = sum + (m?.cost || 0);
        return sum;
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

    const totalMoneyGiven = apiData?.reduce((sum, month) => {
      return sum + (month?.Parents || 0);
    }, 0);

    const monthNumber = new Date().getMonth() + 1;
    const parentsMonthlyIncome = 30000;
    const amountToBePaid = monthNumber * parentsMonthlyIncome;

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
            value: totalStocksAmount?.toFixed(2) - 150000,
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
      {
        label: "Faridabad history",
        value: totalMoneyGiven,
        color: "#ABC02D",
        subCat: [
          {
            label: "Total money given till now",
            value: totalMoneyGiven,
          },
          {
            label: "Amount to be paid till now",
            value: amountToBePaid,
          },
          {
            label: "Remaining Amount till now @ 30000 PM",
            value: amountToBePaid - totalMoneyGiven,
          },
          {
            label: "Interest till now @ 1% (remaining)",
            value: totalInterest,
          },
          {
            label: "Total Taken",
            value: totalFaridabadIncome,
          },
          {
            label: "Interest till now @ 1% (taken amount)",
            value: totalInterestOnAmountTaken,
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
      (month?.["Mumbai Misc"] || 0) +
      (month?.["Mumbai Home Setup Cost"] || 0);

    const faridabadTotal =
      (month?.["Advitya Flat Cost"] || 0) +
      (month?.["Home Loan"] || 0) +
      (month?.["Cred Loan Repay"] || 0) +
      (month?.LIC || 0) +
      (month?.Parents || 0) +
      (month?.["Faridabad Misc"] || 0);

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
              {/* <Box
                flex={{ xs: "1 1 100%", md: "0 0 300px" }}
                minWidth={{ xs: "100%", md: "300px" }}
                maxWidth={{ xs: "100%", md: "300px" }}
              >
                
              </Box> */}

              {/* Summary Cards */}
              <Box display="flex" flexWrap="wrap" width="100%" gap={2}>
                <FormControl
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "100%",
                      md: "10%",
                    },
                  }}
                >
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
                {summaryData.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        flex: {
                          xs: "1 1 100%",
                          sm: "1 1 calc(50% - 16px)",
                          md: "1 1 calc(33.33% - 16px)",
                          lg: "1 1 calc(10% - 16px)",
                        },
                      }}
                    >
                      <Card
                        sx={{
                          bgcolor: "#f5f5f5",
                          boxShadow: 1,
                          color: item.color,
                          height: "100%",
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
                        <CardContent>
                          {item?.subCat &&
                            item?.subCat?.map((item) => {
                              return (
                                <Box
                                  sx={{
                                    bgcolor: "#ffffff",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {item?.label}
                                  </Typography>
                                  <Typography variant="body2">
                                    {formatINRCurrency(item?.value)}
                                  </Typography>
                                </Box>
                              );
                            })}
                        </CardContent>
                        {item.label === "Total Expense" && (
                          <CardContent>
                            <div>
                              <span>
                                <Typography color="red">Note:</Typography>
                              </span>
                              Faridabad Home Expenses =
                              <br /> Advitya Flat Cost +
                              <br /> Home Loan +
                              <br /> Cred Loan Repay +
                              <br /> LIC +
                              <br /> Parents +
                              <br /> Faridabad Misc
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </Box>
                  );
                })}
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
                      <div>
                        <span>
                          <Typography color="red">Note:</Typography>
                        </span>
                        Faridabad Home Expenses =
                        <br /> Advitya Flat Cost +
                        <br /> Home Loan +
                        <br /> Cred Loan Repay +
                        <br /> LIC +
                        <br /> Parents +
                        <br /> Faridabad Misc
                      </div>
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
