const axios = require("axios");

async function generateAIContent(imageUrl) {

    try {

        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openai/gpt-4o-mini",

                messages: [
                    {
                        role: "user",

                        content: [
                            {
                                type: "text",

                                text: `
Analyze this image and generate:

1. caption
2. hashtags (array)
3. mood
4. short story
5. reel script
6. viral hook
7. AI image generation prompt

Return ONLY valid JSON format like this:

{
  "caption": "",
  "hashtags": [],
  "mood": "",
  "story": "",
  "reelScript": "",
  "viralHook": "",
  "aiPrompt": ""
}
`
                            },

                            {
                                type: "image_url",

                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
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

        const content =
            response.data.choices[0].message.content;

        return JSON.parse(content);

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        return {
            caption: "Moments worth sharing 📸",
            hashtags: [],
            mood: "",
            story: "",
            reelScript: "",
            viralHook: "",
            aiPrompt: ""
        };
    }
}

module.exports = generateAIContent;