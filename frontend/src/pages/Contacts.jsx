// frontend/src/pages/Contacts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/contacts/${userId}`
      );
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSyncContacts = async () => {
    try {
      let selectedContacts = [];
      if (navigator.contacts && navigator.contacts.select) {
        const props = ["name", "tel"];
        selectedContacts = await navigator.contacts.select(props, {
          multiple: true,
        });
      } else {
        selectedContacts = [
          { name: ["John Doe"], tel: ["1234567890"] },
          { name: ["Jane Smith"], tel: ["0987654321"] },
        ];
        alert("Contacts Picker API not supported; using simulated contacts");
      }
      const contactsToSync = selectedContacts.map((c) => ({
        name: Array.isArray(c.name) ? c.name[0] : c.name,
        phone: Array.isArray(c.tel) ? c.tel[0] : c.tel,
      }));
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contacts/sync`, {
        userId,
        contacts: contactsToSync,
      });
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError("Error syncing contacts");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Contacts</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleSyncContacts}>
          Sync Contacts
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "#e74c3c" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Copy</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact._id}>
              <td>{index + 1}</td>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>
                <button
                  style={styles.copyButton}
                  onClick={() => handleCopy(contact.phone)}
                >
                  📋 Copy
                </button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan="4" style={styles.noContacts}>
                No contacts found. Please sync contacts.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
  },
  buttonContainer: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 15px",
    margin: "5px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  copyButton: {
    padding: "5px 10px",
    fontSize: "14px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noContacts: {
    textAlign: "center",
    padding: "15px",
    fontSize: "16px",
    color: "#777",
  },
};

export default Contacts;
