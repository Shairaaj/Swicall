import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage"; // Import HomePage
import LoginSignup from "./components/LoginSignup";
import SyncPage from "./components/SyncPage";
import ContactsPage from "./components/ContactsPage";
import PrivacyPolicy from "./components/PrivacyPolicy";

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route
        path="/sync"
        element={token ? <SyncPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/contacts"
        element={token ? <ContactsPage /> : <Navigate to="/login" />}
      />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default App;
