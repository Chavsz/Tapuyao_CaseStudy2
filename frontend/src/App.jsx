import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './Pages/AdminLogin';
import AdminSignup from './Pages/AdminSignUp';
import Layout from "./Layout"; // Import the new Layout component


function App() {

  return (
      <Router>
        <Routes>
          <Route path="/admin-signup" Component={AdminSignup} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/*" element={<Layout />} />
        </Routes>
      </Router>
  );
}

export default App;
