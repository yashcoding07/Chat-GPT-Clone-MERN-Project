const mongoose = require("mongoose");

// this is chat schema which decides how data is stored in the database
const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// this creates the model according to the schema 
const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;