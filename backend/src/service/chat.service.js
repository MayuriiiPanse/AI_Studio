const axios = require("axios");

async function generateChatResponse(
    message,
    userId,
    ragContext = ""
) {
    try {
        const systemPrompt = `
You are an AI Creator Assistant.

Help users with:
- captions
- hashtags
- reel ideas
- YouTube titles
- viral hooks
- branding
- social media strategy
- thumbnail ideas
- content planning
- AI Creator Studio features and workflows

Keep responses creative, practical, and useful.

${
    ragContext
        ? `
Use the following trusted context when it is relevant to the user's question.
Use it naturally.
Do not mention Pinecone, embeddings, vector database, RAG, or knowledge base unless the user directly asks about them.

Trusted context:
${ragContext}
`
        : `
No uploaded project context was found for this question.
Answer normally using your general knowledge.
`
}
`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data
            .choices[0]
            .message
            .content;

    } catch (error) {
        console.log(
            "Chat error:",
            error.response?.data || error.message
        );

        return "AI assistant is currently unavailable.";
    }
}

module.exports = generateChatResponse;