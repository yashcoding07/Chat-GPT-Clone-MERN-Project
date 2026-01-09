const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies) {
            next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid Token"));
        };
    })

    io.on("connection", (socket) => {

        socket.on("ai-message", async (messagePayLoad) => {
            console.log(messagePayLoad);

            const chatHistory = (await messageModel.find({
                chat: messagePayLoad.chat
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse();

            await messageModel.create({
                chat: messagePayLoad.chat,
                user: socket.user._id,
                content: messagePayLoad.content,
                role: "user"
            });

            const chatHistoryWithIncomingMessage = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })

            chatHistoryWithIncomingMessage.push({
                role: "user",
                parts: [{ text: messagePayLoad.content }]
            })

            const response = await aiService.generateResponse(chatHistoryWithIncomingMessage);

            await messageModel.create({
                chat: messagePayLoad.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            });

            socket.emit('ai-response', {
                chat: messagePayLoad.chat,
                content: response
            })
        });
    });
}

module.exports = initSocketServer;