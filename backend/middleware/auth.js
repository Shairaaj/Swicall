const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.log("No Authorization header received");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    if (!token) {
      console.log("Token is null or undefined");
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, deviceId: decoded.deviceId };

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
