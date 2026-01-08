// imports
const express = require("express");
const authControllers = require("../controllers/auth.controllers");

// creates router which helps us in routing
const router = express.Router();

// routes
router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);

module.exports = router;