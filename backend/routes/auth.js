const express = require('express');
const {checkAuth, register, login, logout, refresh, deleteUser, updateProfile, updatePassword} = require('../controllers/auth');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check', protectRoute, checkAuth);
router.post('/logout', logout);
router.post('/refresh', refresh)
router.delete('/user/:id', protectRoute, deleteUser);
router.put('/user/profile', protectRoute, updateProfile);
router.put('/user/password', protectRoute, updatePassword);

module.exports = router;

