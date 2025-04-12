const express = require('express');
const {getUsers, deleteUser, updateProfile, updatePassword} = require('../controllers/users');
const {protectRoute} = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', getUsers);
router.delete('/:id', protectRoute, deleteUser);
router.put('/profile', protectRoute, updateProfile);
router.put('/password', protectRoute, updatePassword);

module.exports = router;

