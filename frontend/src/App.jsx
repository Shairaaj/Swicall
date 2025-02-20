// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Contacts from "./pages/Contacts";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Optional: Listen for storage changes if needed (e.g., multiple tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route path="/signup" element={<Signup setUserId={setUserId} />} />
      <Route path="/login" element={<Login setUserId={setUserId} />} />
      <Route
        path="/contacts"
        element={userId ? <Contacts /> : <Navigate to="/login" />}
      />
      {/* Redirect any unknown route */}
      <Route
        path="*"
        element={<Navigate to={userId ? "/contacts" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
