// frontend/src/pages/Contacts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch contacts from the backend
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/${userId}`);
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
      // Try using the Contacts Picker API (available on some browsers)
      if (navigator.contacts && navigator.contacts.select) {
        const props = ["name", "tel"];
        selectedContacts = await navigator.contacts.select(props, {
          multiple: true,
        });
      } else {
        // Fallback: simulate contact selection for testing
        selectedContacts = [
          { name: ["John Doe"], tel: ["1234567890"] },
          { name: ["Jane Smith"], tel: ["0987654321"] },
        ];
        alert("Contacts Picker API not supported; using simulated contacts");
      }
      // Normalize the contacts (taking the first name and first telephone)
      const contactsToSync = selectedContacts.map((c) => ({
        name: Array.isArray(c.name) ? c.name[0] : c.name,
        phone: Array.isArray(c.tel) ? c.tel[0] : c.tel,
      }));
      // Send contacts to the backend to sync (or resync)
      await axios.post("http://localhost:5000/api/contacts/sync", {
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
    <div style={{ padding: "20px" }}>
      <h2>Contacts</h2>
      <button onClick={handleSyncContacts}>Sync Contacts</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ marginTop: "20px", width: "100%" }}
      >
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
                <button onClick={() => handleCopy(contact.phone)}>Copy</button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No contacts found. Please sync contacts.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Contacts;
