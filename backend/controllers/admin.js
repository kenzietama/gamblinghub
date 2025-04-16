const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const addSaldo = async (req, res) => {
    const { amount } = req.body;
    const userId = req.params.id;
    const adminId = req.user.id;  // The admin's ID from the auth token
    const { role } = req.user;

    try {
        // Validate admin permissions
        if (role !== 1) {
            return res.status(403).json({ message: "Forbidden: You don't have permission to add saldo" });
        }

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Use transaction to ensure both operations succeed or fail together
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

                // Step 1: Check if admin has enough saldo
                const checkAdminSql = "SELECT saldo FROM user WHERE id = ? AND role = 1";
                connection.query(checkAdminSql, [adminId], (err, adminResults) => {
                    if (err || adminResults.length === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(404).json({ message: "Admin not found or database error" });
                        });
                    }

                    const adminSaldo = adminResults[0].saldo || 0;
                    if (adminSaldo < amount) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(400).json({ message: "Insufficient admin saldo" });
                        });
                    }

                    // Step 2: Subtract from admin
                    const updateAdminSql = "UPDATE user SET saldo = saldo - ? WHERE id = ?";
                    connection.query(updateAdminSql, [amount, adminId], (err, adminResult) => {
                        if (err || adminResult.affectedRows === 0) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ message: "Failed to update admin saldo" });
                            });
                        }

                        // Step 3: Add to target user
                        const updateUserSql = "UPDATE user SET saldo = saldo + ? WHERE id = ?";
                        connection.query(updateUserSql, [amount, userId], (err, userResult) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: "Failed to update user saldo" });
                                });
                            }

                            if (userResult.affectedRows === 0) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(404).json({ message: "Target user not found" });
                                });
                            }

                            // Commit the transaction if everything succeeded
                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ message: "Transaction failed" });
                                    });
                                }

                                connection.release();

                                res.status(200).json({
                                    message: "Saldo transferred successfully",
                                    amount: amount,
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Unexpected error in addSaldo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getJackpotHistory = async(req, res) => {
    try {
        const sql = "SELECT history_jackpot.id, menang, result, username FROM history_jackpot LEFT JOIN user ON history_jackpot.user_id = user.id WHERE deleted_at IS NULL ORDER BY id ASC";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error during fetching history:", err);
                return res.status(500).json({ message: "Failed to fetch jackpot history" });
            }

            if (!results || results.length === 0) {
                return res.status(200).json({ message: "No data found" });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Unexpected error in getUsers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const setJackpot = (req,res) => {
    const role = req.user.role;
    const {data} = req.body;

    if (role !== 1) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to set jackpot" });
    }

    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "Invalid or empty array provided" });
        }

        // Create an array of arrays for multiple columns
        const placeholders = data.map(() => "(?, ?)").join(", ");
        const sql = `INSERT INTO history_jackpot (menang, result) VALUES ${placeholders}`;

        // Flatten and duplicate values for both columns
        const flatValues = [];
        data.forEach(value => {
            flatValues.push(value); // for menang
            flatValues.push(value); // for result (same value)
        });

        db.query(sql, flatValues, (err) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            // Return success message
            res.status(200).json({
                message: `Successfully inserted ${data.length} jackpot history records`
            });
        });
    } catch (err) {
        console.error("Error in saveJackpot function:", err);
        res.status(500).json({ message: "Server error" });
    }
}

const softDeleteJackpot = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE history_jackpot SET deleted_at = NOW() WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Jackpot history not found" });
        }

        res.status(200).json({ message: "Jackpot history deleted successfully" });
    });
}

const getJackpotRecycleBin = (req, res) => {
    const sql = "SELECT history_jackpot.id, menang, result, username FROM history_jackpot INNER JOIN user ON history_jackpot.user_id = user.id WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error during fetching recycle bin:", err);
            return res.status(500).json({ message: "Failed to fetch recycle bin" });
        }

        if (!results || results.length === 0) {
            return res.status(200).json({ message: "No data found in recycle bin" });
        }

        res.status(200).json(results);
    });
}

const restoreJackpot = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE history_jackpot SET deleted_at = NULL WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Jackpot history not found" });
        }

        res.status(200).json({ message: "Jackpot history restored successfully" });
    });
}

const deleteJackpot = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM history_jackpot WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Jackpot history not found" });
        }

        res.status(200).json({ message: "Jackpot history deleted successfully" });
    });
}

const getTebakAngka = (req, res) => {
    const sql = "SELECT email, username, tebakan, taruhan FROM tebakangka INNER JOIN user ON tebakangka.user_id = user.id";
    db.query(sql, (err, results) => {
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

// const setAngkaAsli = (req, res) => {
//     const {angkaAsli} = req.body;
//
//     try {
//         const sql = "SELECT email, tebakan, taruhan FROM tebakangka INNER JOIN user ON tebakangka.user_id = user.id WHERE tebakan = ?";
//         db.query(sql, [angkaAsli], (err, results) => {
//             if (err) {
//                 console.error("Database error:", err);
//                 return res.status(500).json({ message: "Server error" });
//             }
//
//             if (!results || results.length === 0) {
//                 const sql4 = "INSERT INTO history_tebakangka (tebakan, taruhan, angkaAsli, user_id) " +
//                     "SELECT tebakan, taruhan, ?, user_id FROM tebakangka";
//                 db.query(sql4, [angkaAsli], (err, results) => {
//                     if (err) {
//                         console.error("Database error:", err);
//                         return res.status(500).json({ message: "Server error4" });
//                     }
//                     // Success handling
//
//                     const sql5 = "DELETE FROM tebakangka";
//                     db.query(sql5, (err, results) => {
//                         if (err) {
//                             console.error("Database error:", err);
//                             return res.status(500).json({ message: "Server error5" });
//                         }
//
//                         return res.status(200).json({ message: "Togel complete" });
//                     });
//                 });
//             }
//
//             const sql2 = "UPDATE user SET saldo = saldo + ? WHERE email = ?";
//             db.query(sql2, [results[0].taruhan * 10, results[0].email], (err, results) => {
//                 if (err) {
//                     console.error("Database error:", err);
//                     return res.status(500).json({ message: "Server error2" });
//                 }
//
//                 const sql3 = "UPDATE user SET saldo = saldo - ? WHERE role = 1";
//                 db.query(sql3, [results[0].taruhan * 10], (err, results) => {
//                     if (err) {
//                         console.error("Database error:", err);
//                         return res.status(500).json({ message: "Server error3" });
//                     }
//
//                     if (results.affectedRows === 0) {
//                         return res.status(404).json({ message: "No data found" });
//                     }
//                 });
//             });
//
//
//
//             // if (results.affectedRows === 0) {
//             //     return res.status(404).json({ message: "No data found" });
//             // }
//
//             res.status(200).json({ message: "Angka asli updated successfully" });
//         });
//     } catch (e) {
//         console.error("Error in setAngkaAsli function:", e);
//         res.status(500).json({ message: "Server errorrrrr" });
//     }
// }

const setAngkaAsli = (req, res) => {
    const { angkaAsli } = req.body;

    try {
        // Start a transaction for data consistency
        db.getConnection((err, connection) => {
            if (err) {
                console.error("Connection error:", err);
                return res.status(500).json({ message: "Database connection error" });
            }

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    console.error("Transaction error:", err);
                    return res.status(500).json({ message: "Database transaction error" });
                }

                // Step 1: Check if there are any matches
                const sql1 = "SELECT email, tebakan, taruhan, user_id FROM tebakangka INNER JOIN user ON tebakangka.user_id = user.id WHERE tebakan = ?";
                connection.query(sql1, [angkaAsli], (err, winners) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error("Database error:", err);
                            return res.status(500).json({ message: "Server error finding winners" });
                        });
                    }

                    // Step 2: Create history records regardless of winners
                    const sqlHistory = "INSERT INTO history_tebakangka (tebakan, taruhan, angka_asli, user_id) SELECT tebakan, taruhan, ?, user_id FROM tebakangka";
                    connection.query(sqlHistory, [angkaAsli], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error("Database error:", err);
                                return res.status(500).json({ message: "Failed to create history records" });
                            });
                        }

                        // Process winners if any
                        if (winners && winners.length > 0) {
                            // We have winners - update their balances
                            const processWinners = () => {
                                let processed = 0;
                                let errors = false;

                                winners.forEach(winner => {
                                    const winAmount = winner.taruhan * 10; // 10x multiplier for winners

                                    // Update winner's balance
                                    const sqlUpdateWinner = "UPDATE user SET saldo = saldo + ? WHERE email = ?";
                                    connection.query(sqlUpdateWinner, [winAmount, winner.email], (err) => {
                                        if (err && !errors) {
                                            errors = true;
                                            return connection.rollback(() => {
                                                connection.release();
                                                console.error("Database error:", err);
                                                return res.status(500).json({ message: "Failed to update winner's balance" });
                                            });
                                        }

                                        // After processing all winners
                                        processed++;
                                        if (processed === winners.length && !errors) {
                                            // Deduct total from admin accounts
                                            const totalPayout = winners.reduce((sum, winner) => sum + (winner.taruhan * 10), 0);
                                            const sqlUpdateAdmin = "UPDATE user SET saldo = saldo - ? WHERE role = 1";
                                            connection.query(sqlUpdateAdmin, [totalPayout], (err) => {
                                                if (err) {
                                                    return connection.rollback(() => {
                                                        connection.release();
                                                        console.error("Database error:", err);
                                                        return res.status(500).json({ message: "Failed to update admin balance" });
                                                    });
                                                }

                                                // Clear tebakangka table
                                                finishProcess();
                                            });
                                        }
                                    });
                                });
                            };

                            // Start processing winners
                            processWinners();
                        } else {
                            // No winners found
                            finishProcess();
                        }

                        // Common function to finish the process
                        function finishProcess() {
                            // Clear tebakangka table
                            const sqlClear = "DELETE FROM tebakangka";
                            connection.query(sqlClear, (err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.error("Database error:", err);
                                        return res.status(500).json({ message: "Failed to clear tebakangka table" });
                                    });
                                }

                                // Commit transaction
                                connection.commit(err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.error("Commit error:", err);
                                            return res.status(500).json({ message: "Transaction commit failed" });
                                        });
                                    }

                                    connection.release();
                                    return res.status(200).json({
                                        message: "Lottery completed successfully",
                                        winners: winners && winners.length > 0 ? winners.length : 0
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
    } catch (e) {
        console.error("Error in setAngkaAsli function:", e);
        res.status(500).json({ message: "Unexpected server error" });
    }
};

const getTogelHistory = (req, res) => {
    const sql = "SELECT email, username, tebakan, taruhan, angka_asli FROM history_tebakangka INNER JOIN user ON history_tebakangka.user_id = user.id";
    db.query(sql, (err, results) => {
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
    addSaldo,
    getJackpotHistory,
    setJackpot,
    softDeleteJackpot,
    getJackpotRecycleBin,
    restoreJackpot,
    deleteJackpot,
    getTebakAngka,
    getTogelHistory,
    setAngkaAsli
}