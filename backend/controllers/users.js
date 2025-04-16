const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

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

const updateProfile = async (req, res) => {
    const {username, email} = req.body;
    const userId = req.user.id;
    const user = req.user;

    try {
        const checkSql = "SELECT * FROM user WHERE email = ? OR username = ?";
        db.query(checkSql, [email, username], (err, results) => {
            if (err) {
                return res.status(500).json({message: "Database error during registration"});
            }

            if (results && results.length > 0) {
                // Check if both email and username match
                const emailExists = results.some(user => user.email === email);
                const usernameExists = results.some(user => user.username === username);

                if (emailExists && usernameExists && (username !== results[0].username || email !== results[0].email)) {
                    return res.status(409).json({message: "Akun sudah ada."});
                } else if (emailExists && email !== results[0].email) {
                    return res.status(409).json({message: "Email sudah digunakan."});
                } else if (usernameExists && username !== results[0].username) {
                    return res.status(409).json({message: "Username sudah digunakan."});
                }
            }
        })

        const sql = "UPDATE user SET username = ?, email = ? WHERE id = ?";
        db.query(sql, [username, email, userId], (err, result) => {
            if (err) {
                console.error("Database error during profile update:", err);
                return res.status(500).json({ message: "Failed to update profile" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken', {
                path: '/api/auth/refresh' // Clear the refresh token cookie
            })

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: email,
                    username: username,
                    saldo: user.saldo,
                    role: user.role || 0,
                },
                process.env.JWT_SECRET,
                { expiresIn: 60 * 60 * 6 } // 1 hour
            );

            const refreshToken = jwt.sign(
                {
                    userId: user.id,
                    email: email,
                    username: username,
                    role: user.role || 0,
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

            res.status(200).json({ message: "Profile updated successfully" });
        });
    } catch (error) {
        console.error("Unexpected error in updateProfile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const updatePassword = async (req, res) => {
    try {
        const {password, newPassword} = req.body;
        const id = req.user.id;

        if (!password || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const sql = "SELECT * FROM user WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error("Database error during update password:", err);
                return res.status(500).json({ message: "Update Password failed" });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const user = results[0];

            try {
                const isPasswordCorrect = bcrypt.compareSync(String(password), user.password);
                if (!isPasswordCorrect) {
                    return res.status(401).json({ message: "Password lama salah." });
                }

                const hashedPassword = bcrypt.hashSync(String(newPassword), 10);
                const sql = "UPDATE user SET password = ? WHERE id = ?";
                db.query(sql, [hashedPassword, id], (err, result) => {
                    if (err) {
                        console.error("Database error during password update:", err);
                        return res.status(500).json({ message: "Failed to update password" });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    res.status(200).json({ message: "Password updated successfully" });
                });
            } catch (e) {
                console.error("error updating password:", e);
                return res.status(500).json({ message: "Authentication error" });
            }
        });
    } catch (error) {
        console.error("Unexpected error in login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUsers = async (req, res) => {
    try {
        const sql = "SELECT id, username, email, saldo FROM user WHERE role = 0";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error during fetching users:", err);
                return res.status(500).json({ message: "Failed to fetch users" });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Unexpected error in getUsers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const sql = "SELECT id, username, email, saldo FROM user WHERE id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("Database error during fetching user:", err);
                return res.status(500).json({message: "Failed to fetch user"});
            }

            if (!results || results.length === 0) {
                return res.status(404).json({message: "User not found"});
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error("Unexpected error in getUserById:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getUserBalance = async (req, res) => {
    const id = req.user.id;

    try {
        const sql = "SELECT saldo FROM user WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error("Database error during fetching user balance:", err);
                return res.status(500).json({ message: "Failed to fetch user balance" });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(  results[0] );
        });
    } catch (error) {
        console.error("Unexpected error in getUserBalance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUserTogelHistory = (req, res) => {
    const userId = req.user.id

    const sql = "SELECT email, username, tebakan, taruhan, angka_asli FROM history_tebakangka INNER JOIN user ON history_tebakangka.user_id = user.id WHERE user.id = ?";
    db.query(sql, [userId],(err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (!results || results.length === 0) {
            return res.status(200).json({ message: "No data found" });
        }

        res.status(200).json(results);
    });
}

module.exports = {
    getUsers,
    deleteUser,
    updateProfile,
    updatePassword,
    getUser,
    getUserBalance,
    getUserTogelHistory
}