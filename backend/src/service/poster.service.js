const axios = require("axios");
const fs = require("fs");
const path = require("path");

const generatePoster = async (userPrompt) => {
    try {
        // =====================================================
        // STEP 1: Validate user prompt
        // =====================================================

        if (!userPrompt || !String(userPrompt).trim()) {
            throw new Error("Poster prompt is required");
        }

        console.log("====================================");
        console.log("🎨 POSTER GENERATION STARTED");
        console.log("====================================");

        // =====================================================
        // STEP 2: Generate professional image prompt using AI
        // =====================================================

        console.log("🤖 Calling OpenRouter...");

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
                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type": "application/json"
                },

                timeout: 60000
            }
        );

        console.log("✅ OpenRouter response received");

        // =====================================================
        // STEP 3: Extract enhanced prompt
        // =====================================================

        let enhancedPrompt =
            aiResponse.data?.choices?.[0]?.message?.content;

        if (!enhancedPrompt) {
            throw new Error(
                "AI could not generate an image prompt"
            );
        }

        // =====================================================
        // STEP 4: Clean enhanced prompt
        // =====================================================

        enhancedPrompt = enhancedPrompt
            .replace(/\*\*/g, "")
            .replace(/#{1,6}\s*/g, "")
            .replace(/Poster Generation Prompt:?/gi, "")
            .replace(/^["']|["']$/g, "")
            .replace(/\n+/g, " ")
            .trim();

        // Keep prompt within 350 characters
        if (enhancedPrompt.length > 350) {
            enhancedPrompt =
                enhancedPrompt.substring(0, 350).trim();
        }

        console.log(
            "✨ Enhanced Prompt:",
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

        console.log("🔑 Pollinations API key found");

        // =====================================================
        // STEP 6: Pollinations URL
        // =====================================================

        const pollinationsUrl =
            `https://gen.pollinations.ai/image/${encodeURIComponent(
                enhancedPrompt
            )}`;

        // =====================================================
        // STEP 7: Generate image
        // =====================================================

        console.log("🎨 Calling Pollinations...");

        const imageResponse = await axios.get(
            pollinationsUrl,
            {
                params: {
                    model: "flux",

                    width: 1024,
                    height: 1024,

                    // IMPORTANT:
                    // -1 means random seed.
                    // Do NOT use Date.now() here.
                    seed: -1
                },

                headers: {
                    Authorization:
                        `Bearer ${process.env.POLLINATIONS_API_KEY}`,

                    Accept: "image/*"
                },

                responseType: "arraybuffer",

                timeout: 180000
            }
        );

        console.log("✅ Pollinations image generated");

        // =====================================================
        // STEP 8: Validate image response
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
        // STEP 9: Create image directory
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
        // STEP 10: Create file name
        // =====================================================

        const fileName =
            `poster-${Date.now()}.png`;

        const filePath =
            path.join(imageDir, fileName);

        // =====================================================
        // STEP 11: Save image
        // =====================================================

        fs.writeFileSync(
            filePath,
            imageResponse.data
        );

        console.log(
            "💾 Poster saved:",
            filePath
        );

        console.log("====================================");
        console.log("🎉 POSTER GENERATION SUCCESSFUL");
        console.log("====================================");

        // =====================================================
        // STEP 12: Return result
        // =====================================================

        return {
            enhancedPrompt,

            imageUrl:
                `/uploads/images/${fileName}`
        };

    } catch (error) {

        console.error("====================================");
        console.error("❌ POSTER GENERATION FAILED");
        console.error("====================================");

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "STATUS:",
            error.response?.status
        );

        // Pollinations returns binary data because
        // responseType is arraybuffer.
        if (error.response?.data) {

            try {

                const errorText =
                    Buffer.from(
                        error.response.data
                    ).toString("utf8");

                console.error(
                    "POLLINATIONS ERROR:",
                    errorText
                );

            } catch (decodeError) {

                console.error(
                    "Could not decode Pollinations error"
                );
            }
        }

        console.error(
            "URL:",
            error.config?.url
        );

        console.error(
            "PARAMS:",
            error.config?.params
        );

        console.error("====================================");

        throw error;
    }
};

module.exports = {
    generatePoster
};