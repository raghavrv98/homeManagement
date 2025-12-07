// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AllRoutes from "./AllRoutes";
import ErrorPage from "./components/ErrorPages/errorPage";
import LoginForm from "./components/LoginForm/LoginForm";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/error" element={<ErrorPage code={401} />} />

        {/* protected pages */}
        <Route path="/*" element={<AllRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
