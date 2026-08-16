const axios = require("axios");
const fs = require("fs");
const path = require("path");

const generatePoster = async (userPrompt) => {
    try {
        // =====================================================
        // STEP 1: Validate prompt
        // =====================================================

        if (!userPrompt || !String(userPrompt).trim()) {
            throw new Error("Poster prompt is required");
        }

        // =====================================================
        // STEP 2: Generate professional image prompt
        // =====================================================

        const aiResponse = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",

                messages: [
                    {
                        role: "system",
                        content: `
You are an expert AI image prompt engineer.

Convert the user's idea into a professional image-generation prompt.

Rules:
- Return ONLY the image prompt.
- No markdown.
- No quotes.
- No headings.
- Maximum 60 words.
- Maximum 350 characters.
- Clearly describe subject, composition, lighting, colors, atmosphere and visual style.
                        `.trim()
                    },

                    {
                        role: "user",
                        content: String(userPrompt).trim()
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );

        // =====================================================
        // STEP 3: Get enhanced prompt
        // =====================================================

        let enhancedPrompt =
            aiResponse.data?.choices?.[0]?.message?.content;

        if (!enhancedPrompt) {
            throw new Error(
                "AI could not generate an image prompt"
            );
        }

        // =====================================================
        // STEP 4: Clean prompt
        // =====================================================

        enhancedPrompt = enhancedPrompt
            .replace(/\*\*/g, "")
            .replace(/#{1,6}\s*/g, "")
            .replace(/Poster Generation Prompt:?/gi, "")
            .replace(/^["']|["']$/g, "")
            .replace(/\n+/g, " ")
            .trim();

        if (enhancedPrompt.length > 350) {
            enhancedPrompt =
                enhancedPrompt.substring(0, 350).trim();
        }

        console.log(
            "Enhanced Poster Prompt:",
            enhancedPrompt
        );

        // =====================================================
        // STEP 5: Validate Pollinations API key
        // =====================================================

        if (!process.env.POLLINATIONS_API_KEY) {
            throw new Error(
                "POLLINATIONS_API_KEY is missing"
            );
        }

        // =====================================================
        // STEP 6: Generate image using Pollinations
        // =====================================================

        const pollinationsUrl =
            `https://gen.pollinations.ai/image/${encodeURIComponent(
                enhancedPrompt
            )}`;

        console.log(
            "Generating image with Pollinations..."
        );

        // =====================================================
        // STEP 7: Create image directory
        // =====================================================

        const imageDir = path.join(
            __dirname,
            "../../uploads/images"
        );

        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, {
                recursive: true
            });
        }

        // =====================================================
        // STEP 8: Generate + download image
        // =====================================================

        const fileName =
            `poster-${Date.now()}.png`;

        const filePath =
            path.join(imageDir, fileName);

        const imageResponse = await axios.get(
            pollinationsUrl,
            {
                params: {
                    model: "flux",
                    width: 1024,
                    height: 1024,
                    seed: Date.now()
                },

                headers: {
                    Authorization:
                        `Bearer ${process.env.POLLINATIONS_API_KEY}`
                },

                responseType: "arraybuffer",

                timeout: 180000
            }
        );

        // =====================================================
        // STEP 9: Validate response
        // =====================================================

        if (
            !imageResponse.data ||
            imageResponse.data.length === 0
        ) {
            throw new Error(
                "Pollinations returned an empty image"
            );
        }

        // =====================================================
        // STEP 10: Save image
        // =====================================================

        fs.writeFileSync(
            filePath,
            imageResponse.data
        );

        console.log(
            "Poster saved successfully:",
            filePath
        );

        // =====================================================
        // STEP 11: Return result
        // =====================================================

        return {
            enhancedPrompt,

            imageUrl:
                `/uploads/images/${fileName}`
        };

    } catch (error) {

        console.error(
            "=============================="
        );

        console.error(
            "POSTER SERVICE ERROR"
        );

        console.error(
            error.response?.status
        );

        console.error(
            error.response?.data
        );

        console.error(
            error.message
        );

        console.error(
            "=============================="
        );

        throw new Error(
            "Poster generation failed. Please try again."
        );
    }
};

module.exports = {
    generatePoster
};