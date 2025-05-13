import React from "react";
import "./Homepage.css"; // Importing the CSS file for styling
import Header from "../Header/Header.jsx";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <Header backLink={"/dashboard"} />
      <div className="container">
        <Button className="box" component={Link} to="./money">
          <div className="box-content">Money</div>
        </Button>
      </div>
    </>
  );
};

export default Homepage;
