const express = require('express');
const { sendMessage, getChatHistory } = require('../../controllers/chatController');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.route('/:projectId')
    .get(protect, getChatHistory)
    .post(protect, sendMessage);

module.exports = router;
