const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

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

            const vectors = await aiService.generateVector(messagePayLoad.content);

            const memory = await queryMemory({
                queryVector: vectors,
                limit: 3,
                metadata: {}
            });

            const message = await messageModel.create({
                chat: messagePayLoad.chat,
                user: socket.user._id,
                content: messagePayLoad.content,
                role: "user"
            });

            await createMemory({
                messageId: message._id,
                vectors,
                metadata: {
                    chatID: messagePayLoad.chat,
                    userID: socket.user._id,
                    text: messagePayLoad.content
                }
            })

            const chatHistory = (await messageModel.find({
                chat: messagePayLoad.chat
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse();

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [{
                        text: `
                        this are some past messages use them to generate response
                        ${memory.map(item => item.metadata.text).join("\n")}`
                    }]
                }
            ]

            console.log([...ltm, ...stm]);

            const response = await aiService.generateResponse([...ltm, ...stm]);

            const responseVectors = await aiService.generateVector(response);

            const responseMessage = await messageModel.create({
                chat: messagePayLoad.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            });

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chatID: messagePayLoad.chat,
                    userID: socket.user._id,
                    text: response
                }
            });


            socket.emit('ai-response', {
                chat: messagePayLoad.chat,
                content: response
            })
        });
    });
}

module.exports = initSocketServer;