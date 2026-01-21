// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const cors = require("cors");
const path = require("path");

// Creates the server
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.static(path.join(__dirname, "../Public")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public/index.html"));
});

module.exports = app;