// imports
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const chatControllers = require("../controllers/chat.controllers");

// routes
router.post("/", authMiddleware.authUser, chatControllers.createChat);

module.exports = router;