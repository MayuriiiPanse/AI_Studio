const ragService = require("../service/rag.service");

const uploadRagDocument = async (req, res) => {
    try {
        const { title, text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const result = await ragService.uploadToPinecone({
            userId: req.user.id,
            title,
            text
        });

        return res.status(201).json({
            success: true,
            message: "Document uploaded to Pinecone successfully",
            document: result
        });

    } catch (error) {
        console.log("RAG Upload Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const searchRagDocument = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }

        const matches = await ragService.searchPinecone({
            userId: req.user.id,
            query
        });

        return res.status(200).json({
            success: true,
            matches
        });

    } catch (error) {
        console.log("RAG Search Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadRagDocument,
    searchRagDocument
};