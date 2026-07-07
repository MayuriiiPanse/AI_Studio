const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'User'

    },

    message: {

        type: String,

        required: true

    },

    response: {

        type: String,

        required: true

    }

}, {

    timestamps: true

});

const chatModel = mongoose.model(

    'Chat',

    chatSchema

);

module.exports = chatModel;