
const { Pinecone } = require("@pinecone-database/pinecone");
const axios = require("axios");

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.index(
    process.env.PINECONE_INDEX_NAME
);

const ragNamespace = index.namespace(
    "ai-creator-studio"
);

// ======================================================
// Generate Embedding
// ======================================================

const generateEmbedding = async (text) => {

    if (!text || !String(text).trim()) {
        throw new Error("Text is required for embedding");
    }

    try {

        const response = await axios.post(

            "https://openrouter.ai/api/v1/embeddings",

            {
                model: "openai/text-embedding-3-small",
                input: String(text).trim()
            },

            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }

        );

        const embedding =
            response.data?.data?.[0]?.embedding;

        if (
            !embedding ||
            !Array.isArray(embedding)
        ) {
            throw new Error(
                "Embedding was not returned by OpenRouter"
            );
        }

        return embedding;

    } catch (error) {

        console.log(
            "Embedding Error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Could not generate embedding"
        );
    }

};

// ======================================================
// Upload to Pinecone
// ======================================================

const uploadToPinecone = async ({
    userId,
    title,
    text,
    type = "document"
}) => {

    if (!text || !String(text).trim()) {
        throw new Error(
            "Text is required for RAG upload"
        );
    }

    const embedding =
        await generateEmbedding(text);

    console.log(
        "Embedding length:",
        embedding.length
    );

    const vectorId =
        `rag-${userId}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;

    const vector = {

        id: vectorId,

        values: embedding,

        metadata: {

            userId: String(userId),

            title: title || "Untitled",

            text: String(text),

            type,

            createdAt:
                new Date().toISOString()

        }

    };

    console.log(
        "Vector ready:",
        vector.id
    );

    await ragNamespace.upsert({

        records: [vector]

    });

    console.log(
        "Saved to Pinecone:",
        vectorId
    );

    return {

        vectorId,

        title: title || "Untitled",

        text,

        type

    };

};

// ======================================================
// Search Pinecone
// ======================================================

const searchPinecone = async ({
    userId,
    query,
    topK = 3
}) => {

    if (!query || !String(query).trim()) {
        return [];
    }

    const queryEmbedding =
        await generateEmbedding(query);

    const result =
        await ragNamespace.query({

            vector: queryEmbedding,

            topK,

            includeMetadata: true,

            filter: {

                userId: {

                    $eq: String(userId)

                }

            }

        });

    const matches =
        result.matches || [];

    console.log(
        "RAG matches found:",
        matches.length
    );

    return matches.map(match => ({

        score: match.score,

        metadata: match.metadata

    }));

};

module.exports = {

    generateEmbedding,

    uploadToPinecone,

    searchPinecone

};