// imports
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// this function registers user
async function registerUser(req, res){
    const {fullName: {firstName, lastName}, email, password} = req.body;
    
    const userExists = await userModel.findOne({email});

    // checks if the user already exists in the database
    if(userExists){
        res.status(400).json({message: "user already exists"});
    }

    // encrypts the password using bcryptjs 
    const hashPassword = await bcrypt.hash(password, 10);

    // creates the user in the database
    const user = await userModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password: hashPassword
    });

    // generates the jwt token to validate the user in future
    const token = jwt.sign({user: user._id}, process.env.JWT_SECRET);

    // stores the token in the cookie of the user
    res.cookie("token", token);

    // sends response
    res.status(201).json({
        message: "User registered successfully",
        user: {
            email: user.email,
            id: user._id,
            fullName: user.fullName
        }
    });
};

// this function logins user
async function loginUser(req, res){
    const { email, password } = req.body;
    const user = await userModel.findOne({email});
    // checks if the email is valid or not
    if(!user){
        res.status(400).json({message: "Invalid email or password"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    // checks if the password is valid or not
    if(!isPasswordValid){
        res.status(400).json({message: "Invalid email or password"});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    // generates and stores token in cookies to validate user
    res.cookie("token", token);

    // response
    res.status(200).json({
        message: "User logged in",
        user: {
            email: user.email,
            id: user._id,
            fullName: user.fullName
        }
    });
};

module.exports = {
    registerUser, loginUser
};