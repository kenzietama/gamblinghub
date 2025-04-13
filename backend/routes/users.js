const express = require('express');
const {getUsers, getUser, deleteUser, updateProfile, updatePassword, addSaldo, getUserBalance} = require('../controllers/users');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/saldo', protectRoute, getUserBalance)
router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', protectRoute, deleteUser);
router.put('/profile', protectRoute, updateProfile);
router.put('/password', protectRoute, updatePassword);
router.post('/:id/saldo', protectRoute, addSaldo)

module.exports = router;

