import "./App.css";
import LoginForm from "./components/LoginForm/LoginForm";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./components/Homepage/Homepage";
import Money from "./components/Money/Money";
import VegetablesAndFruits from "./components/VegetableAndFruits/VegetableAndFruits";
import Milk from "./components/Milk/Milk";
import KiranaStore from "./components/KiranaStore/KiranaStore";
import FastFood from "./components/FastFood/FastFood";
import Homeneeds from "./components/Homeneeds/Homeneeds";
import Petrol from "./components/Petrol/Petrol";
import Dashboard from "./components/Dashboard/Dashboard";
import DataTables from "./components/DataTables/DataTables";
import HouseRent from "./components/HouseRent/HouseRent";
import WifiBill from "./components/WifiBill/WifiBill";
import Graphs from "./components/Graphs/Graphs";
import Outing from "./components/Outing/Outing";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define the routes for each page */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dataTables" element={<DataTables />} />
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
          <Route path="/home/money/outing" element={<Outing />} />
          <Route path="/graphs" element={<Graphs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
