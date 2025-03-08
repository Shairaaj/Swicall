import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Ensure a deviceId is stored in localStorage
  useEffect(() => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deviceId = localStorage.getItem("deviceId");

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(
        endpoint,
        { email, password, deviceId },
        {
          baseURL: import.meta.env.VITE_API_BASE_URL,
        }
      );

      // Ensure token exists before storing
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      } else {
        console.error("No token received from server!");
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Force a full reload after redirect so that the App rechecks authentication
      if (isSignup) {
        window.location.assign("/sync");
      } else {
        window.location.assign("/contacts");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <hr />
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Switch to Login" : "Switch to Sign Up"}
      </button>
    </div>
  );
};

export default LoginSignup;
