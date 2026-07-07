const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    { 
        ragVectorId: {
        type: String,
        default: null
       },
        image: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            default: ""
        },

        hashtags: {
            type: [String],
            default: []
        },

        mood: {
            type: String,
            default: ""
        },

        story: {
            type: String,
            default: ""
        },

        reelScript: {
            type: String,
            default: ""
        },

        viralHook: {
            type: String,
            default: ""
        },

        aiPrompt: {
            type: String,
            default: ""
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
