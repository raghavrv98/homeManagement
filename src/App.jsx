import "./App.css";
import LoginForm from "./components/LoginForm/LoginForm";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./components/Homepage/Homepage";
import Money from "./components/Money/Money";
import Milk from "./components/Forms/Milk/Milk";
import KiranaStore from "./components/Forms/KiranaStore/KiranaStore";
import FastFood from "./components/Forms/FastFood/FastFood";
import Homeneeds from "./components/Forms/Homeneeds/Homeneeds";
import Petrol from "./components/Forms/Petrol/Petrol";
import Dashboard from "./components/Dashboard/Dashboard";
import DataTables from "./components/DataTables/DataTables";
import HouseRent from "./components/Forms/HouseRent/HouseRent";
import WifiBill from "./components/Forms/WifiBill/WifiBill";
import Graphs from "./components/Graphs/Graphs";
import Outing from "./components/Forms/Outing/Outing";
import VegetablesAndFruits from "./components/Forms/VegetableAndFruits/VegetableAndFruits";
import DashboardTab from "./components/DashboardTab/DashboardTab";
import ElectricityBill from "./components/Forms/ElectricityBill/ElectricityBill";
import GasBill from "./components/Forms/GasBill/GasBill";
import Income from "./components/Forms/Income/Income";
import Investment from "./components/Forms/Investment/Investment";
import LIC from "./components/Forms/LIC/LIC";
import HomeLoan from "./components/Forms/HomeLoan/HomeLoan";
import Parents from "./components/Forms/Parents/parents";
import PersonalExpense from "./components/Forms/PersonalExpense/PersonalExpense";
import GiftToAmisha from "./components/Forms/GiftToAmisha/GiftToAmisha";
import AdvityaFlatCost from "./components/Forms/Advitya Flat Cost/AdvityaFlatCost";
import MumbaiHomeSetupCost from "./components/Forms/MumbaiHomeSetupCost/MumbaiHomeSetupCost";
import CredLoanRepay from "./components/Forms/CredLoanRepay/CredLoanRepay";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define the routes for each page */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dataTables" element={<DataTables />} />
          <Route path="/dashboardTab" element={<DashboardTab />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/money" element={<Money />} />
          <Route
            path="/home/money/vegetables-fruits"
            element={<VegetablesAndFruits />}
          />
          <Route path="/home/money/milk" element={<Milk />} />
          <Route path="/home/money/kirana-store" element={<KiranaStore />} />
          <Route path="/home/money/fast-food" element={<FastFood />} />
          <Route path="/home/money/homeneeds" element={<Homeneeds />} />
          <Route path="/home/money/petrol" element={<Petrol />} />
          <Route path="/home/money/houseRent" element={<HouseRent />} />
          <Route path="/home/money/wifiBill" element={<WifiBill />} />
          <Route
            path="/home/money/electricityBill"
            element={<ElectricityBill />}
          />
          <Route path="/home/money/credLoanRepay" element={<CredLoanRepay />} />
          <Route path="/home/money/gasBill" element={<GasBill />} />
          <Route path="/home/money/income" element={<Income />} />
          <Route path="/home/money/investment" element={<Investment />} />
          <Route path="/home/money/lic" element={<LIC />} />
          <Route path="/home/money/homeLoan" element={<HomeLoan />} />
          <Route path="/home/money/parents" element={<Parents />} />
          <Route path="/home/money/outing" element={<Outing />} />
          <Route
            path="/home/money/personalExpense"
            element={<PersonalExpense />}
          />
          <Route path="/home/money/giftToAmisha" element={<GiftToAmisha />} />
          <Route
            path="/home/money/advityaFlatCost"
            element={<AdvityaFlatCost />}
          />
          <Route
            path="/home/money/mumbaiHomeSetupCost"
            element={<MumbaiHomeSetupCost />}
          />

          <Route path="/graphs" element={<Graphs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
