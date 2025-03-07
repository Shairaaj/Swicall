import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./components/LoginSignup";
import SyncPage from "./components/SyncPage";
import ContactsPage from "./components/ContactsPage";

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/contacts" /> : <LoginSignup />}
      />
      <Route
        path="/sync"
        element={token ? <SyncPage /> : <Navigate to="/" />}
      />
      <Route
        path="/contacts"
        element={token ? <ContactsPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
