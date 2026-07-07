// require('dotenv').config();
// const app = require('./src/app');
// const connectToDB = require('./src/db/db');



// connectToDB();
// app.listen(3000,()=>{
//     console.log("Server is running on port 3000");
// })

require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectToDB = require("./src/db/db");

const initializeSocket = require(
    "./src/socket/socket.server"
);

const PORT = process.env.PORT || 3000;

// Create one HTTP server for both Express + Socket.io
const server = http.createServer(app);

// Attach Socket.io to the same server
initializeSocket(server);

// Connect MongoDB
connectToDB();

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});