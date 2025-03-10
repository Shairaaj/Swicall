// components/SyncPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  font-family: "Arial", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px 10px 10px 0;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Thead = styled.thead`
  background-color: #f1f1f1;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const Tbody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: #fafafa;
    }
  }
`;

const SyncPage = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");
  const [googleToken, setGoogleToken] = useState(null);
  const navigate = useNavigate();

  // Read token, deviceId, and user from localStorage
  const token = localStorage.getItem("token");
  const deviceId = localStorage.getItem("deviceId");
  const user = JSON.parse(localStorage.getItem("user"));
  const isSameDevice = user && user.deviceId === deviceId;

  useEffect(() => {
    // Load Google Identity Services if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleGoogleSignIn = () => {
    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.oauth2
    ) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          import.meta.env.VITE_GOOGLE_CLIENT_ID ||
          "658234338795-h2ajtsollajd0g3o1lt56o5l884iab0q.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/contacts.readonly",
        callback: (response) => {
          if (response.error) {
            setMessage("Google sign-in failed");
          } else {
            setGoogleToken(response.access_token);
            syncContacts(response.access_token);
          }
        },
      });
      console.log(import.meta.env.VITE_API_BASE_URL);
      client.requestAccessToken();
    } else {
      setMessage("Google API not loaded");
    }
  };

  const syncContacts = async (accessToken) => {
    console.log("Access Token being sent:", accessToken);
    if (!isSameDevice) {
      setMessage("Modifications are not allowed from this device.");
      return;
    }
    // Guard: if token is missing or "null", do not call the API
    if (!token || token === "null") {
      setMessage("User not authenticated");
      return;
    }
    try {
      const res = await axios.post(
        "/api/contacts/sync",
        { accessToken },
        {
          baseURL: import.meta.env.VITE_API_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-device-id": deviceId,
          },
        }
      );
      console.log("response", res.data);
      if (Array.isArray(res.data)) {
        setContacts(res.data);
        setMessage("Contacts synced successfully");
      } else {
        setMessage("Unexpected data format from sync endpoint.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Sync failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleCopy = (phone) => {
    navigator.clipboard.writeText(phone);
  };

  const handleRemove = async (id) => {
    if (!isSameDevice) {
      setMessage("Modifications are not allowed from this device.");
      return;
    }
    if (!token || token === "null") {
      setMessage("User not authenticated");
      return;
    }
    try {
      await axios.delete(`/api/contacts/${id}`, {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: { Authorization: `Bearer ${token}`, "x-device-id": deviceId },
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (err) {
      console.error("ERROR:", err);
      setMessage(err.response?.data?.message || "Remove failed");
    }
  };

  return (
    <Container>
      <Header>Sync Contacts</Header>
      {isSameDevice && (
        <Button onClick={handleGoogleSignIn}>Sync Contacts with Google</Button>
      )}
      <Button onClick={handleLogout}>Logout</Button>
      {message && <Message>{message}</Message>}
      {contacts.length > 0 && (
        <Table>
          <Thead>
            <tr>
              <Th>Serial No.</Th>
              <Th>Contact Name</Th>
              <Th>Phone Number</Th>
              <Th>Copy</Th>
              {isSameDevice && <Th>Remove</Th>}
            </tr>
          </Thead>
          <Tbody>
            {contacts.map((contact, index) => (
              <tr key={contact._id}>
                <Td>{index + 1}</Td>
                <Td>{contact.name}</Td>
                <Td>{contact.phone}</Td>
                <Td>
                  <Button onClick={() => handleCopy(contact.phone)}>
                    Copy
                  </Button>
                </Td>
                {isSameDevice && (
                  <Td>
                    <Button onClick={() => handleRemove(contact._id)}>
                      Remove
                    </Button>
                  </Td>
                )}
              </tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
};

export default SyncPage;
