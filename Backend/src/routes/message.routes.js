const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Route to send a message
router.post("/send", authMiddleware.authUser, messageController.sendMessage);

// Route to get messages for a specific chat
router.get("/:chatId", authMiddleware.authUser, messageController.getMessages);

module.exports = router;
