import React from "react";
import "./Dashboard.css";
import Header from "../Header/Header.jsx";
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  TableChart,
  AttachMoney,
  BarChart,
} from "@mui/icons-material";

const dashboardItems = [
  {
    label: "Dashboard",
    path: "/dashboardTab",
    icon: <DashboardIcon />,
    color: "#FFAB91", // Soft Coral
  },
  {
    label: "Data Tables",
    path: "/dataTables",
    icon: <TableChart />,
    color: "#FFE082", // Warm Yellow
  },
  {
    label: "Forms",
    path: "/home/money",
    icon: <AttachMoney />,
    color: "#80DEEA", // Aqua Blue
  },
  // {
  //   label: "Graphs",
  //   path: "/graphs",
  //   icon: <BarChart />,
  //   color: "#CE93D8", // Light Purple
  // },
];

const amishaDashboardItems = [
  {
    label: "Amisha Dashboard",
    path: "/amishaDashboardTab",
    icon: <DashboardIcon />,
    color: "#B39DDB", // Lavender Purple
  },
  {
    label: "Amisha Data Tables",
    path: "/amishaDataTables",
    icon: <TableChart />,
    color: "#CE93D8", // Coral
  },
  {
    label: "Amisha Forms",
    path: "/home/amishaMoney",
    icon: <AttachMoney />,
    color: "#AED581", // Fresh Green
  },
];

const Dashboard = () => {
  return (
    <>
      <Header isShowBack={false} isShowLogout={true} backLink="/home" />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
          justifyContent: "center",
        }}
      >
        {dashboardItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "calc(100% / 4 - 16px)",
              minWidth: "150px",
            }}
          >
            <Button
              component={Link}
              to={item.path}
              sx={{
                width: "100%",
                height: "120px",
                borderRadius: 3,
                textTransform: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontWeight: "bold",
                fontSize: "0.85rem",
                boxShadow: 3,
                backgroundColor: item.color,
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
          justifyContent: "center",
        }}
      >
        {amishaDashboardItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "calc(100% / 4 - 16px)",
              minWidth: "150px",
            }}
          >
            <Button
              component={Link}
              to={item.path}
              sx={{
                width: "100%",
                height: "120px",
                borderRadius: 3,
                textTransform: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontWeight: "bold",
                fontSize: "0.85rem",
                boxShadow: 3,
                backgroundColor: item.color,
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

export default Dashboard;
