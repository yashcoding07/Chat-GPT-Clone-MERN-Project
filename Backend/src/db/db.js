const mongoose = require("mongoose");

// function connects to the database 
async function connectToDb(){ 
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to the database: ", error);
    }
}

module.exports = connectToDb;