const express = require('express');
const {getUsers, getUser, deleteUser, updateProfile, updatePassword, addSaldo, getUserBalance, getUserTogelHistory} = require('../controllers/users');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/saldo', protectRoute, getUserBalance)
router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', protectRoute, deleteUser);
router.put('/profile', protectRoute, updateProfile);
router.put('/password', protectRoute, updatePassword);
router.get('/tebakangka/history', protectRoute, getUserTogelHistory)

module.exports = router;

