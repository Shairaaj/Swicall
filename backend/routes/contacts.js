const express = require("express");
const router = express.Router();
const axios = require("axios");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// GET all contacts for authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
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
    if (!accessToken)
      return res.status(400).json({ message: "Access token is required" });

    // Check device verification (only allow if device matches)
    const deviceId = req.headers["x-device-id"];
    if (deviceId !== req.user.deviceId) {
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
    await Contact.deleteMany({ user: req.user._id });
    const newContacts = contactsData.map((contact) => ({
      ...contact,
      user: req.user._id,
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
    const deviceId = req.headers["x-device-id"];
    if (deviceId !== req.user.deviceId) {
      return res
        .status(403)
        .json({ message: "Device not verified for modifications" });
    }
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    await contact.remove();
    res.json({ message: "Contact removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
