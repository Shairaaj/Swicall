// routes/privacyPolicy.js
const express = require("express");
const router = express.Router();

// GET /privacy
router.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Privacy Policy</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.6;
        color: #333;
      }
      h1, h2 {
        color: #222;
      }
      p {
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <h1>Privacy Policy</h1>
    <p>
      This Privacy Policy ("Policy") explains how Swicallcollects, uses, and disc loses information when you use our application ("App").
    </p>
    <h2>Information Collection and Use</h2>
    <p>
      We collect various types of information to provide and improve our App. This includes information you provide directly as well as information collected automatically.
    </p>
    <h2>Log Data</h2>
    <p>
      When you use our App, our servers may automatically record information ("Log Data") that your browser sends whenever you visit our App.
    </p>
    <h2>Cookies</h2>
    <p>
      We use cookies and similar tracking technologies to track activity on our App and hold certain information.
    </p>
    <h2>Security</h2>
    <p>
      The security of your personal information is important to us, but remember that no method of transmission over the Internet is 100% secure.
    </p>
    <h2>Changes to This Privacy Policy</h2>
    <p>
      We may update our Privacy Policy from time to time. Any changes will be posted on this page.
    </p>
    <p>
      If you have any questions about this Privacy Policy, please contact us.
    </p>
  </body>
</html>`);
});

module.exports = router;
