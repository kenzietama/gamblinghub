const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if(!token){
            return res.status(401).json({message: "Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid Token"})
        }

        const sql = "SELECT username FROM user WHERE email = ?";
        db.query(sql, [decoded.email], (err, results) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" });
            if (results.length === 0) return res.status(401).json({ message: "User not found" });

            req.user = results[0];
            next()
        });
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    protectRoute
}