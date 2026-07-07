const express = require('express');

const chatrouter = express.Router();

const authMiddleware = require(
    '../middlewares/auth.middleware'
);

const {

    chatController

} = require(
    '../controller/chatController'
);


// AI CHAT ROUTE
chatrouter.post(

    '/ai',

    authMiddleware,

    chatController

);

module.exports = chatrouter;