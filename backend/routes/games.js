const express = require('express');
const {bet, updateBalance, playJackpot, saveJackpotHistory, insertJackpotHistory} = require('../controllers/games');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/bet', protectRoute, bet);
router.post('/updatebalance', protectRoute, updateBalance);
router.get('/playjackpot', protectRoute, playJackpot);
router.post('/playjackpot/:id/:result', protectRoute, saveJackpotHistory);

module.exports = router;