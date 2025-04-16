const express = require('express');
const {addSaldo, setJackpot, getJackpotHistory, softDeleteJackpot,
    getJackpotRecycleBin, restoreJackpot,
    deleteJackpot, getTebakAngka, setAngkaAsli, getTogelHistory} = require('../controllers/admin');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/usersaldo/:id/', protectRoute, addSaldo)
router.get('/jackpot', getJackpotHistory)
router.post('/jackpot/set', protectRoute, setJackpot)
router.put('/jackpot/:id', protectRoute, softDeleteJackpot)
router.get('/jackpot/recyclebin', protectRoute, getJackpotRecycleBin)
router.put('/jackpot/recyclebin/:id', protectRoute, restoreJackpot)
router.delete('/jackpot/recyclebin/:id', protectRoute, deleteJackpot)
router.get('/lottery', protectRoute, getTebakAngka)
router.post('/lottery/finish', protectRoute, setAngkaAsli)
router.get('/lottery/history', protectRoute, getTogelHistory)
module.exports = router;
