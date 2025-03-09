//components/SyncPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SyncPage = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");
  const [googleToken, setGoogleToken] = useState(null);
  const navigate = useNavigate();

  // Read token, deviceId and user from localStorage
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
          "512062808924-tgna45rk0e6dcuacdmjjj2lo4v59m9gq.apps.googleusercontent.com",
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
    // Redirect to login page and force a full reload
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
    // Guard: if token is missing or "null", do not proceed
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
      console.error("ERROR:",err);
      setMessage(err.response?.data?.message || "Remove failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sync Contacts</h2>
      {isSameDevice && (
        <button onClick={handleGoogleSignIn}>Sync Contacts with Google</button>
      )}
      <button onClick={handleLogout}>Logout</button>
      {message && <p>{message}</p>}
      {contacts.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Contact Name</th>
              <th>Phone Number</th>
              <th>Copy</th>
              {isSameDevice && <th>Remove</th>}
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact._id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>
                  <button onClick={() => handleCopy(contact.phone)}>
                    Copy
                  </button>
                </td>
                {isSameDevice && (
                  <td>
                    <button onClick={() => handleRemove(contact._id)}>
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SyncPage;