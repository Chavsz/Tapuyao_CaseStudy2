import './App.css';
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminLogin from './Pages/AdminLogin';
import Layout from "./Layout"; // Import the new Layout component
import Logout from './Pages/Logout'; // Import the new Logout component

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/admin-login'); // Redirect to admin login page if not logged in
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

export default App;
