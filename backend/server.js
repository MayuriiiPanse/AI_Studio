// require('dotenv').config();
// const app = require('./src/app');
// const connectToDB = require('./src/db/db');



// connectToDB();
// app.listen(3000,()=>{
//     console.log("Server is running on port 3000");
// })

const http = require("http");
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

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

async function startServer() {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not configured');
        }

        await connectToDB();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error.message);
        process.exitCode = 1;
    }
}

startServer();