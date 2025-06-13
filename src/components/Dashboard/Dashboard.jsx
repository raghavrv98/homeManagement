import React from "react";
import "./Dashboard.css"; // Importing the CSS file for styling
import Header from "../Header/Header.jsx";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <Header isShowBack={false} isShowLogout={true} backLink={"/home"} />
      <div className="dashboardContainer">
        <Button className="box" component={Link} to="/dashboardTab">
          <div className="box-content">Dashboard</div>
        </Button>
        <Button className="box" component={Link} to="/dataTables">
          <div className="box-content">Data Tables</div>
        </Button>
        <Button className="box" component={Link} to="/home/money">
          <div className="box-content">Forms</div>
        </Button>
        <Button className="box" component={Link} to="/graphs">
          <div className="box-content">Graphs</div>
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
