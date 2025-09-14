import React from "react";
import "./Money.css";
import Header from "../Header/Header.jsx";
import { Button, Box } from "@mui/material";
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
    icon: <ShoppingCart />,
    color: "#A8E6CF",
  },
  { label: "Milk", path: "milk", icon: <LocalDrink />, color: "#FFD3B6" },
  {
    label: "Kirana Store",
    path: "kirana-store",
    icon: <Storefront />,
    color: "#FFAAA5",
  },
  {
    label: "Fast Food",
    path: "fast-food",
    icon: <Fastfood />,
    color: "#FF8C94",
  },
  { label: "HomeNeeds", path: "homeNeeds", icon: <Home />, color: "#DCE775" },
  {
    label: "Petrol",
    path: "petrol",
    icon: <LocalGasStation />,
    color: "#FFF176",
  },
  { label: "House Rent", path: "houseRent", icon: <House />, color: "#AED581" },
  { label: "Wifi Bill", path: "wifiBill", icon: <Wifi />, color: "#4FC3F7" },
  {
    label: "Electricity Bill",
    path: "electricityBill",
    icon: <FlashOn />,
    color: "#FFB74D",
  },
  { label: "Gas Bill", path: "gasBill", icon: <Whatshot />, color: "#E57373" },
  { label: "Income", path: "income", icon: <AttachMoney />, color: "#81C784" },
  {
    label: "Investment",
    path: "investment",
    icon: <TrendingUp />,
    color: "#64B5F6",
  },
  { label: "LIC", path: "lic", icon: <Security />, color: "#9575CD" },
  {
    label: "HomeLoan",
    path: "homeLoan",
    icon: <AccountBalance />,
    color: "#7986CB",
  },
  { label: "Parents", path: "parents", icon: <Elderly />, color: "#F48FB1" },
  { label: "Outing", path: "outing", icon: <Hiking />, color: "#4DB6AC" },
  {
    label: "Personal Expense",
    path: "personalExpense",
    icon: <Wallet />,
    color: "#BA68C8",
  },
  {
    label: "Advitya Flat Cost",
    path: "advityaFlatCost",
    icon: <Apartment />,
    color: "#90A4AE",
  },
  {
    label: "Mumbai Home Setup Cost",
    path: "mumbaiHomeSetupCost",
    icon: <Build />,
    color: "#A1887F",
  },
  {
    label: "Cred Loan Repay",
    path: "credLoanRepay",
    icon: <CreditCard />,
    color: "#FFD74D",
  },
  {
    label: "Mumbai Misc",
    path: "mumbaiMisc",
    icon: <Wallet />,
    color: "#FFCC80",
  },
  {
    label: "Faridabad Misc",
    path: "faridabadMisc",
    icon: <Wallet />,
    color: "#80DEEA",
  },
];

const Money = () => {
  return (
    <>
      <Header backLink="/dashboard" />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
          justifyContent: "center",
        }}
      >
        {categories.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "calc(100% / 6 - 16px)",
              minWidth: "150px",
            }}
          >
            <Button
              component={Link}
              to={`./${item.path}`}
              sx={{
                width: "100%",
                height: "120px",
                borderRadius: 3,
                boxShadow: 3,
                textTransform: "none",
                whiteSpace: "normal",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: item.color,
                color: "#333",
                fontWeight: "bold",
                fontSize: "0.85rem",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 5,
                  backgroundColor: item.color,
                },
              }}
            >
              <Box sx={{ fontSize: 32, mb: 1 }}>{item.icon}</Box>
              {item.label}
            </Button>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Money;
