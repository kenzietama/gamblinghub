const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const sql = "SELECT * FROM user WHERE email = ?";
        db.query(sql, [email], (err, results) => {
            if (err) {
                console.error("Database error during login:", err);
                return res.status(500).json({ message: "Login failed" });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const user = results[0];

            try {
                const isPasswordCorrect = bcrypt.compareSync(String(password), user.password);
                if (!isPasswordCorrect) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                try {
                    const token = jwt.sign(
                        {
                            userId: user.id,
                            email: user.email,
                            username: user.username,
                            saldo: user.saldo,
                            role: user.role || 'user',
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: 60 * 60 * 6 } // 1 hour
                    );

                    const refreshToken = jwt.sign(
                        {
                            userId: user.id,
                            email: user.email,
                            username: user.username,
                            role: user.role || 'user',
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: 60 * 60 * 24 * 7 } // 7 days
                    );

                    res.cookie('accessToken', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000
                    });

                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'strict',
                        path: '/api/auth/refresh',
                        maxAge: 60 * 60 * 24 * 7 * 1000
                    });

                    res.status(200).json({
                        email: user.email,
                        username: user.username
                    });
                } catch (jwtError) {
                    console.error("JWT error:", jwtError);
                    return res.status(500).json({ message: "Authentication error" });
                }
            } catch (bcryptError) {
                console.error("bcrypt error:", bcryptError);
                return res.status(500).json({ message: "Authentication error" });
            }
        });
    } catch (error) {
        console.error("Unexpected error in login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const register = (req, res) => {
    const {email, username, password} = req.body;

    // First check if user already exists with this email
    const checkSql = "SELECT * FROM user WHERE email = ? OR username = ?";
    db.query(checkSql, [email, username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error during registration" });
        }

        if (results && results.length > 0) {
            // Check if both email and username match
            const emailExists = results.some(user => user.email === email);
            const usernameExists = results.some(user => user.username === username);

            if (emailExists && usernameExists) {
                return res.status(409).json({ message: "Akun sudah ada, silahkan login." });
            } else if (emailExists) {
                return res.status(409).json({ message: "Email sudah digunakan." });
            } else if (usernameExists) {
                return res.status(409).json({ message: "Username sudah digunakan." });
            }
        }

        // If no existing user, proceed with registration
        bcrypt.hash(String(password), 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error hashing password" });
            }

            const sql = "INSERT INTO user (email, username, password) VALUES (?, ?, ?)";
            db.query(sql, [email, username, hash], (err, result) => {
                if (err) {
                    console.log("Registration error:", err.code, err.sqlMessage);
                    return res.status(500).json({ message: "Registrasi gagal" });
                }

                res.status(201).json({
                    message: "User registered successfully",
                    userId: result.insertId
                });
            });
        });
    });
}

const logout = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken', {
            path: '/api/auth/refresh' // Clear the refresh token cookie
        })
        res.status(200).json({message: "Berhasil logout"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
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
            {
                userId: decoded.userId,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 } // 1 hour
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // HTTPS only in production
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

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    // Optional: Check if the user being deleted is the authenticated user
    // or if the authenticated user has admin privileges
    if (req.user.id !== parseInt(userId) && req.user.role !== 1) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to delete this user" });
    }

    try {
        // Begin transaction for safer deletion
        db.getConnection((err, connection) => {
            if (err) {
                console.error("Connection error:", err);
                return res.status(500).json({ message: "Database connection error" });
            }

            // Begin transaction on the specific connection
            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    console.error("Transaction error:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                // Delete the user
                const sql = "DELETE FROM user WHERE id = ?";
                connection.query(sql, [userId], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error("Delete error:", err);
                            res.status(500).json({ message: "Failed to delete user" });
                        });
                    }

                    if (result.affectedRows === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(404).json({ message: "User not found" });
                        });
                    }

                    // Commit the transaction
                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error("Commit error:", err);
                                res.status(500).json({ message: "Transaction failed" });
                            });
                        }

                        // Release the connection back to the pool
                        connection.release();

                        // Clear auth cookies if user deleted themselves
                        if (req.user.id === parseInt(userId)) {
                            res.clearCookie('accessToken');
                            res.clearCookie('refreshToken');
                        }

                        res.status(200).json({
                            message: "User deleted successfully",
                            deleted: true
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    login,
    register,
    logout,
    checkAuth,
    refresh,
    deleteUser
}