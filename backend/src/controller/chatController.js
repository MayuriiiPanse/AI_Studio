
const generateChatResponse = require(
    "../service/chat.service"
);

const chatModel = require(
    "../models/chat.model"
);

const historyService = require(
    "../service/history.service"
);

/*
==================================================
HTTP CHAT API

POST /api/chat/ai

Headers:
Authorization: Bearer YOUR_TOKEN

Body:
{
    "message": "Explain RAG in simple words"
}
==================================================
*/

const chatController = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const cleanMessage = message.trim();

        // AI response from existing chat service
        const aiResponse = await generateChatResponse(
            cleanMessage,
             req.user.id
        );

        // Save chat
        const chat = await chatModel.create({
            user: req.user._id,
            message: cleanMessage,
            response: aiResponse
        });

        // Save history
        await historyService.saveHistory({
            user: req.user._id,
            type: "chat",
            data: {
                prompt: cleanMessage,
                response: aiResponse
            }
        });

        return res.status(201).json({
            success: true,
            message: "Chat generated successfully",
            chat
        });

    } catch (error) {
        console.log("CHAT CONTROLLER ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Chat failed"
        });
    }
};

module.exports = {
    chatController
};