import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Records from "./Pages/Records"
import Settings from "./Pages/Settings";
import Households from "./Pages/Households";
import Business from "./Pages/Business";
import { ToastContainer } from "react-toastify";
import './App.css';

function Layout() {

  return (
    <div className="container">
      <div className="sidebar"><Navbar /></div>
      <div className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/households" element={<Households />} />
          <Route path="/business" element={<Business />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;