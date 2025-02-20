// server/routes/contacts.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Sync contacts endpoint
// Expects: { userId, contacts: [{ name, phone }, ...] }
router.post("/sync", async (req, res) => {
  try {
    const { userId, contacts } = req.body;
    // Delete previous contacts for this user (supports resync functionality)
    await Contact.deleteMany({ user: userId });
    // Prepare new contacts with the user ID
    const newContacts = contacts.map((contact) => ({
      ...contact,
      user: userId,
    }));
    await Contact.insertMany(newContacts);
    res.json({ message: "Contacts synced successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get contacts for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const contacts = await Contact.find({ user: userId });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
