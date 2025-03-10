// components/LoginSignup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
  font-family: "Arial", sans-serif;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ToggleButton = styled.button`
  margin-top: 15px;
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const Footer = styled.footer`
  margin-top: 20px;
  font-size: 0.9em;
  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

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
    <Container>
      <FormWrapper>
        <Title>{isSignup ? "Sign Up" : "Login"}</Title>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">{isSignup ? "Sign Up" : "Login"}</Button>
        </form>
        {message && <ErrorMessage>{message}</ErrorMessage>}
        <ToggleButton onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "Need an account? Sign Up"}
        </ToggleButton>
        <Footer>
          <p>
            <a
              href="https://www.termsfeed.com/live/238d42f3-8c51-4d88-9faa-5a2d8767c8a7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            |{" "}
            <a
              href="https://www.termsfeed.com/live/8f8a50da-0e7e-4e1a-9039-681429a322a0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
          </p>
        </Footer>
      </FormWrapper>
    </Container>
  );
};

export default LoginSignup;
