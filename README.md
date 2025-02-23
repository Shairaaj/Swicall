# Swicall
Swicall is a MERN-based web app that lets users access their phone contacts online when they don’t have their phone.

Authentication: Users sign up with name, email, and password. OTP (via Resend) is required only for signup, not for login. Welcome emails are sent for both signup and login. A forgot password feature sends a 6-digit OTP via email.
Contact Syncing: Uses Contact Picker API (Chrome-only) to sync contacts and store them in MongoDB (encrypted).
UI: Displays contacts in a table format with name, phone number, serial number, and a copy button for quick access.
Security:
Passwords: Stored using bcrypt (one-way hash, no decryption).
Contacts: Encrypted using AES (allows decryption for display).