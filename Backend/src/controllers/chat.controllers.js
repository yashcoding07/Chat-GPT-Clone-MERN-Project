const chatModel = require("../models/chat.model");

// this function creates a new chat in the database taking title from the user
async function createChat(req, res){
    const { title } = req.body;
    const user = req.user;

    // this creates chat 
    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfuly",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity
        }
    });
}

module.exports = {
    createChat
}