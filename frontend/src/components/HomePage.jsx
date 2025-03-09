//components/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to Swicall</h1>
      <p>
        Swicall helps you sync and manage your contacts easily. Our app securely
        accesses your contacts to provide a seamless experience.
      </p>
      <h2>Why We Need Permissions?</h2>
      <p>
        We request access to your contacts to allow you to sync and manage them
        efficiently. We do not store or share your data with third parties.
      </p>
      <h2>Privacy Policy</h2>
      <p>
        You can read our full privacy policy <a href="/privacy">here</a>.
      </p>
      <h2>Get Started</h2>
      <Link to="/sync">
        <button
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Sync Contacts
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
