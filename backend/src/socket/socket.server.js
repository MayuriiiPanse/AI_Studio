const { Server } = require("socket.io");

const generateChatResponse = require(
    "../service/chat.service"
);

const chatModel = require(
    "../models/chat.model"
);

const historyService = require(
    "../service/history.service"
);

const {
    searchPinecone,
    uploadToPinecone
} = require("../service/rag.service");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        /*
        CLIENT SENDS EVENT:
        chat-message

        SERVER SENDS EVENT:
        chat-response

        Payload:
        {
            "userId": "YOUR_MONGODB_USER_ID",
            "message": "Give me Instagram reel ideas for a coffee shop"
        }
        */

        socket.on("chat-message", async (data) => {
            try {
                const { userId, message } = data || {};

                if (!userId) {
                    return socket.emit("chat-response", {
                        success: false,
                        message: "userId is required"
                    });
                }

                if (!message || !message.trim()) {
                    return socket.emit("chat-response", {
                        success: false,
                        message: "message is required"
                    });
                }

                const cleanMessage = message.trim();

                // 1. Search previous user knowledge/chats from Pinecone.
                // If search fails, normal chat should still work.
                let ragResults = [];

                try {
                    ragResults = await searchPinecone({
                        userId,
                        query: cleanMessage,
                        topK: 5
                    });
                } catch (ragError) {
                    console.log(
                        "RAG search error:",
                        ragError.response?.data || ragError.message
                    );
                }

                const ragContext = ragResults
                    .map((item) => item.metadata?.text)
                    .filter(Boolean)
                    .join("\n\n");

                console.log("RAG matches found:", ragResults.length);

                // 2. Generate AI response using retrieved context.
                const aiResponse = await generateChatResponse(
                    cleanMessage,
                    userId,
                    ragContext
                );

                // 3. Save chat in MongoDB.
                const chat = await chatModel.create({
                    user: userId,
                    message: cleanMessage,
                    response: aiResponse
                });

                // 4. Save chat in History collection.
                await historyService.saveHistory({
                    user: userId,
                    type: "chat",
                    data: {
                        prompt: cleanMessage,
                        response: aiResponse,
                        ragUsed: ragResults.length > 0
                    }
                });

                // 5. Save THIS new conversation into Pinecone.
                // This makes future socket messages able to retrieve it.
                let pineconeSaved = false;
                let pineconeVectorId = null;

                try {
                    const pineconeResult = await uploadToPinecone({
                        userId,
                        title: "AI Creator Studio Chat",
                        type: "chat",
                        text: `User: ${cleanMessage}\n\nAI Assistant: ${aiResponse}`
                    });

                    pineconeSaved = true;
                    pineconeVectorId = pineconeResult.vectorId;

                    console.log(
                        "Socket chat saved to Pinecone:",
                        pineconeVectorId
                    );
                } catch (pineconeError) {
                    // Chat must not fail just because Pinecone save fails.
                    console.log(
                        "Pinecone chat save error:",
                        pineconeError.response?.data ||
                        pineconeError.message
                    );
                }

                // 6. Send real-time result back to the same client.
                socket.emit("chat-response", {
                    success: true,
                    message: "Chat generated successfully",
                    ragUsed: ragResults.length > 0,
                    sourcesFound: ragResults.length,
                    pineconeSaved,
                    pineconeVectorId,
                    chat
                });

            } catch (error) {
                console.log(
                    "SOCKET CHAT ERROR:",
                    error.response?.data || error.message
                );

                socket.emit("chat-response", {
                    success: false,
                    message: error.message || "Chat failed"
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = initializeSocket;