const axios = require("axios");

const createEmbedding = async (text) => {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/embeddings",
            {
                model: "openai/text-embedding-3-small",
                input: text
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.data[0].embedding;

    } catch (error) {
        console.log(
            "Embedding error:",
            error.response?.data || error.message
        );

        throw new Error("Could not create embedding");
    }
};

module.exports = {
    createEmbedding
};