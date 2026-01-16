const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");

async function sendMessage(req, res) {
    try {
        const { chatId, content, role } = req.body;
        const userId = req.user._id;

        if (!chatId || !content) {
            return res.status(400).json({ message: "Chat ID and Content are required" });
        }

        const newMessage = await messageModel.create({
            user: userId,
            chat: chatId,
            content,
            role: role || "user"
        });

        // Update last activity of the chat
        await chatModel.findByIdAndUpdate(chatId, { lastActivity: Date.now() });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required" });
        }

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    sendMessage,
    getMessages
};
