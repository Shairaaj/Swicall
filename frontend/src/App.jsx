// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Contacts from "./pages/Contacts";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Listen for storage changes (e.g., multiple tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.header}>
        Swicall: A Lifeline for When You Forget Your Phone
      </h1>
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
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "40px",
    background: "linear-gradient(135deg, #ffffff, #e6f7ff)",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
    color: "#007acc",
  },
};

export default App;
