import React from "react";
import "./AmishaMoney.css";
import Header from "../Header/Header.jsx";
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import {
  AttachMoney,
  TrendingUp,
  Wallet,
  Redeem,
  Replay,
} from "@mui/icons-material";

// ✅ Include Income, Investment, Expenses, Repay, Gift Cost
const categories = [
  {
    label: "Income",
    path: "amishaIncome",
    icon: <AttachMoney />,
    color: "#81C784", // Green
  },
  {
    label: "Investment",
    path: "amishaInvestment",
    icon: <TrendingUp />,
    color: "#64B5F6", // Blue
  },
  {
    label: "Expenses",
    path: "amishaExpenses",
    icon: <Wallet />,
    color: "#BA68C8", // Purple
  },
  {
    label: "Repay",
    path: "amishaRepay",
    icon: <Replay />,
    color: "#FFB74D", // Orange
  },
  {
    label: "Gift Cost",
    path: "amishaGiftCost",
    icon: <Redeem />,
    color: "#E57373", // Red
  },
];

const AmishaMoney = () => {
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
              width: "calc(100% / 3 - 16px)", // Responsive grid (3 items across)
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
                fontSize: "0.95rem",
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

export default AmishaMoney;
