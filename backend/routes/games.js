const express = require('express');
const {bet, updateBalance} = require('../controllers/games');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/bet', protectRoute, bet);
router.post('/updatebalance', protectRoute, updateBalance);

module.exports = router;