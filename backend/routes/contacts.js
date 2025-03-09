//routes/contacts.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");
const mongoose= require("mongoose");

// GET all contacts for authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST sync contacts using Google People API
// Expects body: { accessToken }
router.post("/sync", auth, async (req, res) => {
  try {
    const { accessToken } = req.body;
    console.log("Received access token:",accessToken);
    if (!accessToken)
      return res.status(400).json({ message: "Access token is required" });

    // Check device verification (only allow if device matches)
    const deviceId = req.headers["x-device-id"];
    
    if (deviceId !== req.user.deviceId) {
    console.log("Device from header:", req.headers["x-device-id"]);
    console.log("User's device ID:", req.user.deviceId);
      return res
        .status(403)
        .json({ message: "Device not verified for modifications" });
    }

    // Call Google People API using the URL from .env
    const googleResponse = await axios.get(process.env.GOOGLE_PEOPLE_API, {
      params: { pageSize: 1000 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const connections = googleResponse.data.connections || [];
    console.log("collections: ",connections);
    const contactsData = connections
      .map((person) => {
        let name =
          person.names && person.names.length > 0
            ? person.names[0].displayName
            : "No Name";
        let phone =
          person.phoneNumbers && person.phoneNumbers.length > 0
            ? person.phoneNumbers[0].value
            : "";
        return { name, phone };
      })
      .filter((contact) => contact.phone !== "");

    // Remove all previous contacts and insert the new ones
    await Contact.deleteMany({ user: req.user.id });
    console.log("User ID from auth middleware:", req.user.id);
    const newContacts = contactsData.map((contact) => ({
      ...contact,
      user: req.user.id,
    }));
    const savedContacts = await Contact.insertMany(newContacts);
    res.json(savedContacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a contact by its ID
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("Request to delete contact:", req.params.id);
    console.log("User making the request:", req.user.id);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Convert user ID to ObjectId (if necessary)
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Find contact before deleting
    const contact = await Contact.findOne({ _id: req.params.id, user: userId });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Delete the contact
    await Contact.deleteOne({ _id: req.params.id });

    res.json({ message: "Contact removed successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
