const express = require('express');
const { verifyGoogleToken, register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/google', verifyGoogleToken);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
