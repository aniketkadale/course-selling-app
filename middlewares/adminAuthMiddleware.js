require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

async function adminAuthMiddleware(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({ error: "Please sign in as a admin first" });
    }

    const verifiedToken = jwt.verify(token, JWT_SECRET_ADMIN);

    if (verifiedToken) {
      req.userId = verifiedToken.id;
      next();
    } else {
      return res.status(403).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { adminAuthMiddleware };
