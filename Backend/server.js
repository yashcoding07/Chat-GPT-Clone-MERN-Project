// makes environment variables avaiable to the entire application
require("dotenv").config();
// imports
const app = require("./src/app");
const connectToDb = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = require("http").createServer(app);

// connects to database
connectToDb()

// this initializes the socket server 
initSocketServer(httpServer);

// starts the server
httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});