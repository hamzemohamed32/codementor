const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/:projectId')
    .post(protect, sendMessage)
    .get(protect, getChatHistory);

module.exports = router;
