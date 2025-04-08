const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const sql = "SELECT * FROM user WHERE email = ?";
        db.query(sql, [email], (err, results) => {
            if (err) return res.status(500).json({ message: "Login failed" });
            if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

            const user = results[0];

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: 60 * 60 } // 1 hour
            );

            const refreshToken = jwt.sign(
                { userId: user.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: 60 * 60 * 24 * 7 } // 7 days
            );

            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: true, // HTTPS only
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000 // 60 minutes
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/api/refresh', // Restrict to refresh endpoint
                maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days
            });

            res.json({ success: true, user: { username: user.username } });
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const register = (req, res) => {
    const {email, username, password} = req.body;
    bcrypt.hash(String(password), 10, (err, hash) => {
        if (err) {
            console.error("Bcrypt error:", err);
            return res.status(500).json({ message: "Error hashing password" });
        }

        const sql = "INSERT INTO user (email, username, password) VALUES (?, ?, ?)";
        db.query(sql, [email, username, hash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes('email')) {
                        return res.status(409).json({ message: "Email already in use" });
                    }
                    if (err.sqlMessage.includes('username')) {
                        return res.status(409).json({ message: "Username already taken" });
                    }
                    return res.status(409).json({ message: "User already exists, go to login page" });
                }
                return res.status(500).json({ message: "Registration failed" });
            }

            res.status(201).json({
                message: "User registered successfully",
                userId: result.insertId
            });
        });
    });
}

const logout = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, username: decoded.username },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 } // 1 hour
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
        });

        return res.json({
            success: true,
            message: "Token refreshed successfully"
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Refresh token expired" });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        return res.status(500).json({ message: "Failed to refresh token" });
    }
};

module.exports = {
    login,
    register,
    logout,
    checkAuth,
    refresh
}