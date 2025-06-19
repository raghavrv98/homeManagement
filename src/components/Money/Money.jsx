import React from "react";
import "./Money.css"; // Importing the CSS file for styling
import Header from "../Header/Header.jsx";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Money = () => {
  return (
    <>
      <Header backLink={"/dashboard"} />
      <div className="container">
        <Button className="box" component={Link} to="./vegetables-fruits">
          <div className="box-content">Vegetables & Fruits</div>
        </Button>
        <Button className="box" component={Link} to="./milk">
          <div className="box-content">Milk</div>
        </Button>
        <Button className="box" component={Link} to="./kirana-store">
          <div className="box-content">Kirana Store</div>
        </Button>
        <Button className="box" component={Link} to="./fast-food">
          <div className="box-content">Fast Food</div>
        </Button>
        <Button className="box" component={Link} to="./homeNeeds">
          <div className="box-content">HomeNeeds</div>
        </Button>
        <Button className="box" component={Link} to="./petrol">
          <div className="box-content">Petrol</div>
        </Button>
        <Button className="box" component={Link} to="./houseRent">
          <div className="box-content">House Rent</div>
        </Button>
        <Button className="box" component={Link} to="./wifiBill">
          <div className="box-content">Wifi Bill</div>
        </Button>
        <Button className="box" component={Link} to="./electricityBill">
          <div className="box-content">Electricity Bill</div>
        </Button>
        <Button className="box" component={Link} to="./gasBill">
          <div className="box-content">Gas Bill</div>
        </Button>
        <Button className="box" component={Link} to="./income">
          <div className="box-content">Income</div>
        </Button>
        <Button className="box" component={Link} to="./investment">
          <div className="box-content">Investment</div>
        </Button>
        <Button className="box" component={Link} to="./lic">
          <div className="box-content">LIC</div>
        </Button>
        <Button className="box" component={Link} to="./homeLoan">
          <div className="box-content">HomeLoan</div>
        </Button>
        <Button className="box" component={Link} to="./parents">
          <div className="box-content">Parents</div>
        </Button>
        <Button className="box" component={Link} to="./outing">
          <div className="box-content">Outing</div>
        </Button>
        <Button className="box" component={Link} to="./personalExpense">
          <div className="box-content">Personal Expense</div>
        </Button>
        <Button className="box" component={Link} to="./giftToAmisha">
          <div className="box-content">Gift To Amisha</div>
        </Button>
        <Button className="box" component={Link} to="./advityaFlatCost">
          <div className="box-content">Advitya Flat Cost</div>
        </Button>
        <Button className="box" component={Link} to="./mumbaiHomeSetupCost">
          <div className="box-content">Mumbai Home Setup Cost</div>
        </Button>
      </div>
    </>
  );
};

export default Money;
