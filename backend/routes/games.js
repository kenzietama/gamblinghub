const express = require('express');
const {bet, updateBalance, playJackpot, saveJackpotHistory, setLottery, getUserLottery} = require('../controllers/games');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/bet', protectRoute, bet);
router.post('/updatebalance', protectRoute, updateBalance);
router.get('/playjackpot', protectRoute, playJackpot);
router.post('/playjackpot/:id/:result', protectRoute, saveJackpotHistory);
router.post('/lottery', protectRoute, setLottery);
router.get('/lottery', protectRoute, getUserLottery)

module.exports = router;