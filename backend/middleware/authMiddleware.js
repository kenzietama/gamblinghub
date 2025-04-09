const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protectRoute = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sql = "SELECT username FROM user WHERE email = ?";
        db.query(sql, [decoded.email], (err, results) => {
            if (err) {
                console.error("Database error in auth middleware:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = results[0];
            next();
        });
    } catch (error) {
        console.log("JWT verification error:", error.name, error.message);

        // Handle different JWT errors appropriately
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired",
                code: "TOKEN_EXPIRED" // Special code for the client to identify
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            // For other unexpected errors
            console.error("Unexpected auth error:", error);
            return res.status(500).json({ message: "Authentication error" });
        }
    }
};

module.exports = {
    protectRoute
};