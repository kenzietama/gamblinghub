const db = require('../config/db');

const bet = (req, res) => {
    const userId = req.user.id;
    const {amount} = req.body;

    // Check if the user has enough balance
    try {
        const sql = "SELECT saldo FROM user WHERE id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = results[0];
            if (user.saldo < amount) {
                return res.status(400).json({ message: "Insufficient balance" });
            }

            // Deduct the bet amount from the user's balance
            const updateSql = "UPDATE user SET saldo = ? WHERE id = ?";
            const newBalance = user.saldo - amount;
            db.query(updateSql, [newBalance, userId], (err) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Server error" });
                }

                // Return the new balance
                res.status(200).json({ message: "Bet placed successfully", newBalance });
            });
        });
    } catch (err) {
        console.error("Error in bet function:", e);
        res.status(500).json({ message: "Server error" });
    }
}

const updateBalance = (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;

    try {
        // Input validation
        if (!amount || typeof amount !== 'number') {
            return res.status(400).json({ message: "Invalid amount" });
        }

        db.getConnection((err, connection) => {
            if (err) {
                console.error("Connection error:", err);
                return res.status(500).json({ message: "Database connection error" });
            }

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    console.error("Transaction error:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                // Find admin account (assuming role = 1)
                const findAdminSql = "SELECT id FROM user WHERE role = 1 LIMIT 1";
                connection.query(findAdminSql, (err, adminResults) => {
                    if (err || adminResults.length === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(404).json({ message: "Admin not found" });
                        });
                    }

                    const adminId = adminResults[0].id;

                    // Update admin balance (no balance check as requested)
                    const updateAdminSql = "UPDATE user SET saldo = saldo - ? WHERE id = ?";
                    connection.query(updateAdminSql, [amount, adminId], (err, adminResult) => {
                        if (err || adminResult.affectedRows === 0) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ message: "Failed to update admin balance" });
                            });
                        }

                        // Update user balance
                        const updateUserSql = "UPDATE user SET saldo = saldo + ? WHERE id = ?";
                        connection.query(updateUserSql, [amount, userId], (err, userResult) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: "Failed to update user balance" });
                                });
                            }

                            if (userResult.affectedRows === 0) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(404).json({ message: "User not found" });
                                });
                            }

                            // Get the updated user balance
                            const getUserSql = "SELECT saldo FROM user WHERE id = ?";
                            connection.query(getUserSql, [userId], (err, results) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ message: "Failed to get updated balance" });
                                    });
                                }

                                connection.commit(err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            res.status(500).json({ message: "Transaction failed" });
                                        });
                                    }

                                    connection.release();
                                    res.status(200).json({
                                        message: "Balance updated successfully",
                                        saldo: results[0].saldo
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error in updateBalance function:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const playJackpot = (req, res) => {
    const role = req.user.role;

    if(role !== 0) {
        return res.status(403).json({ message: "Admin unable to play" });
    }

    try {
        const sql = "SELECT id, menang FROM history_jackpot WHERE user_id IS NULL LIMIT 1";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!results || results.length === 0) {
                return res.status(200).json({ id: -1, menang: -1 });
            }

            return res.status(200).json( results[0] );
        });
    } catch (err) {
        console.error("Error in playJackpot function:", err);
        res.status(500).json({ message: "Server error" });
    }
}

const saveJackpotHistory = (req, res) => {
    const userId = req.user.id;
    const { id, result } = req.params;

    try {
        const sql = id === "-1"
            ? "INSERT INTO history_jackpot (user_id, result) VALUES (?, ?)"
            : "UPDATE history_jackpot SET user_id = ? WHERE id = ?";

        const params = id === "-1"
            ? [userId, result]
            : [userId, id];

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ message: "No jackpot history found" });
            }

            return res.status(200).json({ message: "Jackpot history saved successfully" });
        });
    } catch (err) {
        console.error("Error in saveJackpotHistory function:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// const setLottery = (req, res) => {
//     const userId = req.user.id;
//     // The data is inside req.body.data, not directly in req.body
//     const data  = req.body;
//
//     try {
//         if (!data || !Array.isArray(data) || data.length === 0) {
//             return res.status(400).json({ message: "Invalid or empty array provided" });
//         }
//
//         console.log("Received data:", data); // Debug log
//
//         // Calculate total bet amount
//         const totalBet = data.reduce((sum, item) => sum + Number(item.taruhan), 0);
//
//         // Use transaction to ensure data consistency
//         db.getConnection((err, connection) => {
//             if (err) {
//                 console.error("Connection error:", err);
//                 return res.status(500).json({ message: "Database connection error" });
//             }
//
//             connection.beginTransaction(err => {
//                 if (err) {
//                     connection.release();
//                     console.error("Transaction error:", err);
//                     return res.status(500).json({ message: "Database error" });
//                 }
//
//                 // Check if user has enough balance
//                 connection.query("SELECT saldo FROM user WHERE id = ?", [userId], (err, results) => {
//                     if (err || !results || results.length === 0) {
//                         return connection.rollback(() => {
//                             connection.release();
//                             res.status(404).json({ message: "User not found" });
//                         });
//                     }
//
//                     const userBalance = results[0].saldo;
//                     if (userBalance < totalBet) {
//                         return connection.rollback(() => {
//                             connection.release();
//                             res.status(400).json({ message: "Insufficient balance" });
//                         });
//                     }
//
//                     // Update user balance
//                     connection.query(
//                         "UPDATE user SET saldo = saldo - ? WHERE id = ?",
//                         [totalBet, userId],
//                         (err) => {
//                             if (err) {
//                                 return connection.rollback(() => {
//                                     connection.release();
//                                     res.status(500).json({ message: "Failed to update balance" });
//                                 });
//                             }
//
//                             // Create placeholders for each row
//                             const placeholders = data.map(() => "(?, ?, ?)").join(", ");
//                             const sql = `INSERT INTO tebakangka (tebakan, taruhan, user_id) VALUES ${placeholders}`;
//
//                             // Flatten the array for the query
//                             const flatValues = [];
//                             data.forEach(item => {
//                                 flatValues.push(item.tebakan);
//                                 flatValues.push(item.taruhan);
//                                 flatValues.push(userId);
//                             });
//
//                             connection.query(sql, flatValues, (err) => {
//                                 if (err) {
//                                     return connection.rollback(() => {
//                                         connection.release();
//                                         console.error("Insert error:", err);
//                                         res.status(500).json({ message: "Failed to save lottery entries" });
//                                     });
//                                 }
//
//                                 connection.commit(err => {
//                                     if (err) {
//                                         return connection.rollback(() => {
//                                             connection.release();
//                                             res.status(500).json({ message: "Transaction failed" });
//                                         });
//                                     }
//
//                                     connection.release();
//                                     res.status(200).json({
//                                         message: `Successfully inserted ${data.length} lottery guesses`,
//                                         newBalance: userBalance - totalBet
//                                     });
//                                 });
//                             });
//                         }
//                     );
//                 });
//             });
//         });
//     } catch (err) {
//         console.error("Error in setLottery function:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const setLottery = (req, res) => {
    const userId = req.user.id;
    const data = req.body.data || req.body;

    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "Invalid or empty array provided" });
        }

        console.log("Processing lottery data:", data);

        // Calculate total bet amount
        const totalBet = data.reduce((sum, item) => sum + Number(item.taruhan), 0);

        // Use transaction to ensure data consistency
        db.getConnection((err, connection) => {
            if (err) {
                console.error("Connection error:", err);
                return res.status(500).json({ message: "Database connection error" });
            }

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    console.error("Transaction error:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                // Check if user has enough balance
                connection.query("SELECT saldo FROM user WHERE id = ?", [userId], (err, results) => {
                    if (err || !results || results.length === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(404).json({ message: "User not found" });
                        });
                    }

                    const userBalance = results[0].saldo;
                    if (userBalance < totalBet) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(400).json({ message: "Insufficient balance" });
                        });
                    }

                    // Update user balance
                    connection.query(
                        "UPDATE user SET saldo = saldo - ? WHERE id = ?",
                        [totalBet, userId],
                        (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error("Balance update error:", err);
                                    res.status(500).json({ message: "Failed to update balance" });
                                });
                            }

                            // Create placeholders for batch insert
                            const placeholders = data.map(() => "(?, ?, ?)").join(", ");
                            const sql = `INSERT INTO tebakangka (tebakan, taruhan, user_id) VALUES ${placeholders}`;

                            // Flatten the array for the query
                            const flatValues = [];
                            data.forEach(item => {
                                flatValues.push(item.tebakan);
                                flatValues.push(item.taruhan);
                                flatValues.push(userId);
                            });

                            connection.query(sql, flatValues, (err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.error("Insert error:", err);
                                        res.status(500).json({ message: "Failed to save lottery entries" });
                                    });
                                }

                                // Get updated balance
                                connection.query("SELECT saldo FROM user WHERE id = ?", [userId], (err, balanceResult) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            res.status(500).json({ message: "Failed to get updated balance" });
                                        });
                                    }

                                    connection.commit(err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                res.status(500).json({ message: "Transaction failed" });
                                            });
                                        }

                                        connection.release();
                                        res.status(200).json({
                                            message: `Successfully inserted ${data.length} lottery guesses`,
                                            newBalance: balanceResult[0].saldo
                                        });
                                    });
                                });
                            });
                        }
                    );
                });
            });
        });
    } catch (err) {
        console.error("Error in setLottery function:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserLottery = (req, res) => {
    const userId = req.user.id;

    try {
        const sql = "SELECT * FROM tebakangka WHERE user_id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ message: "No lottery guesses found" });
            }

            return res.status(200).json(results);
        });
    } catch (err) {
        console.error("Error in getUserLottery function:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    bet,
    updateBalance,
    playJackpot,
    saveJackpotHistory,
    setLottery,
    getUserLottery
}