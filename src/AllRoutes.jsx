// src/AllRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// All Components
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
import AdvityaFlatCost from "./components/Forms/Advitya Flat Cost/AdvityaFlatCost";
import MumbaiHomeSetupCost from "./components/Forms/MumbaiHomeSetupCost/MumbaiHomeSetupCost";
import CredLoanRepay from "./components/Forms/CredLoanRepay/CredLoanRepay";
import AmishaDashboardTab from "./components/AmishaDashboard/AmishaDashboardTab";
import AmishaDataTables from "./components/AmishaDataTables/AmishaDataTables";
import AmishaMoney from "./components/AmishaMoney/AmishaMoney";
import AmishaExpense from "./components/AmishaForms/AmishaExpense/AmishaExpense";
import AmishaInvestment from "./components/AmishaForms/Investment/AmishaInvestment";
import AmishaIncome from "./components/AmishaForms/AmishaIncome/AmishaIncome";
import AmishaRepay from "./components/AmishaForms/AmishaRepay/AmishaRepay";
import AmishaGiftCost from "./components/AmishaForms/AmishaGiftCost/AmishaGiftCost";
import MumbaiMisc from "./components/Forms/MumbaiMisc/MumbaiMisc";
import FaridabadMisc from "./components/Forms/FaridabadMisc/FaridabadMisc";
import ErrorPage from "./components/ErrorPages/errorPage";
import AmishaMonthlyExpense from "./components/AmishaForms/AmishaMonthlyExpense/AmishaMonthlyExpense";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataTables"
        element={
          <ProtectedRoute>
            <DataTables />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboardTab"
        element={
          <ProtectedRoute>
            <DashboardTab />
          </ProtectedRoute>
        }
      />

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Money */}
      <Route
        path="/home/money"
        element={
          <ProtectedRoute>
            <Money />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/vegetables-fruits"
        element={
          <ProtectedRoute>
            <VegetablesAndFruits />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/milk"
        element={
          <ProtectedRoute>
            <Milk />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/kirana-store"
        element={
          <ProtectedRoute>
            <KiranaStore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/fast-food"
        element={
          <ProtectedRoute>
            <FastFood />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/homeneeds"
        element={
          <ProtectedRoute>
            <Homeneeds />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/petrol"
        element={
          <ProtectedRoute>
            <Petrol />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/houseRent"
        element={
          <ProtectedRoute>
            <HouseRent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/wifiBill"
        element={
          <ProtectedRoute>
            <WifiBill />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/electricityBill"
        element={
          <ProtectedRoute>
            <ElectricityBill />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/gasBill"
        element={
          <ProtectedRoute>
            <GasBill />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/income"
        element={
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/investment"
        element={
          <ProtectedRoute>
            <Investment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/lic"
        element={
          <ProtectedRoute>
            <LIC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/homeLoan"
        element={
          <ProtectedRoute>
            <HomeLoan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/parents"
        element={
          <ProtectedRoute>
            <Parents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/outing"
        element={
          <ProtectedRoute>
            <Outing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/personalExpense"
        element={
          <ProtectedRoute>
            <PersonalExpense />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/mumbaiMisc"
        element={
          <ProtectedRoute>
            <MumbaiMisc />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/faridabadMisc"
        element={
          <ProtectedRoute>
            <FaridabadMisc />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/advityaFlatCost"
        element={
          <ProtectedRoute>
            <AdvityaFlatCost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/mumbaiHomeSetupCost"
        element={
          <ProtectedRoute>
            <MumbaiHomeSetupCost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/money/credLoanRepay"
        element={
          <ProtectedRoute>
            <CredLoanRepay />
          </ProtectedRoute>
        }
      />

      <Route
        path="/graphs"
        element={
          <ProtectedRoute>
            <Graphs />
          </ProtectedRoute>
        }
      />

      {/* AMISHA */}
      <Route
        path="/home/amishaMoney"
        element={
          <ProtectedRoute>
            <AmishaMoney />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/amishaMoney/amishaIncome"
        element={
          <ProtectedRoute>
            <AmishaIncome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/amishaMoney/amishaInvestment"
        element={
          <ProtectedRoute>
            <AmishaInvestment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/amishaMoney/amishaMonthlyExpense"
        element={
          <ProtectedRoute>
            <AmishaMonthlyExpense />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/amishaMoney/amishaExpenses"
        element={
          <ProtectedRoute>
            <AmishaExpense />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/amishaMoney/amishaRepay"
        element={
          <ProtectedRoute>
            <AmishaRepay />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home/amishaMoney/amishaGiftCost"
        element={
          <ProtectedRoute>
            <AmishaGiftCost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/amishaDashboardTab"
        element={
          <ProtectedRoute>
            <AmishaDashboardTab />
          </ProtectedRoute>
        }
      />

      <Route
        path="/amishaDataTables"
        element={
          <ProtectedRoute>
            <AmishaDataTables />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<ErrorPage code={404} />} />
    </Routes>
  );
};

export default AllRoutes;
