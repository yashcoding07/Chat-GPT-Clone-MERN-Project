// imports
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// this is a middleware which is used to validate the user from the token before going to the chats
async function authUser(req, res, next){
    const { token } = req.cookies;
    // checks if token is present or not
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }
    // verifies the token if it is correct let's the user to go to the chat else not
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message: "Unauthorized"});
    }
}

module.exports = {
    authUser
}