const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }
    });

    // socket.io middleware: which validates the user and attaches the user to the socket
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

    // socket.io connection handler: this establishes the connection between the client and the server
    io.on("connection", (socket) => {

        console.log("User connected", socket.user._id);

        socket.on("ai-message", async (messagePayLoad) => {

            const [message, vectors] = await Promise.all([
                messageModel.create({
                    chat: messagePayLoad.chat,
                    user: socket.user._id,
                    content: messagePayLoad.content,
                    role: "user"
                }),
                aiService.generateVector(messagePayLoad.content),
            ]);

            await createMemory({
                messageId: message._id,
                vectors,
                metadata: {
                    chatID: messagePayLoad.chat,
                    userID: socket.user._id,
                    text: messagePayLoad.content
                }
            });

            const [memory, chatHistory] = await Promise.all([
                queryMemory({
                    queryVector: vectors,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),
                messageModel.find({
                    chat: messagePayLoad.chat
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ]);

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })

            // this serves as the long term memory for the AI
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

            // this generates the response from the AI
            const response = await aiService.generateResponse([...ltm, ...stm]);

            // this emits the response back to the client
            socket.emit('ai-response', {
                chat: messagePayLoad.chat,
                content: response
            });

            const [responseVectors, responseMessage] = await Promise.all([
                aiService.generateVector(response),
                messageModel.create({
                    chat: messagePayLoad.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"
                })
            ]);

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chatID: messagePayLoad.chat,
                    userID: socket.user._id,
                    text: response
                }
            });
        });
    });
}

module.exports = initSocketServer;