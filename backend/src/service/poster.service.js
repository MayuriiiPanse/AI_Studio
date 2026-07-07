const axios = require("axios");
const fs = require("fs");
const path = require("path");

const generatePoster = async (userPrompt) => {
  // Generate enhanced prompt
  const aiResponse = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          // content:
          //     "Convert user ideas into detailed professional poster generation prompts. Return only the prompt."
          content: `
You are an expert AI image prompt engineer.

Generate a professional image prompt.

Rules:
- Return ONLY the prompt.
- No markdown.
- No quotes.
- Maximum 60 words.
- Maximum 350 characters.
- Focus on subject, lighting, colors, composition and style.
`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // const enhancedPrompt =
  //     aiResponse.data.choices[0].message.content;

  let enhancedPrompt = aiResponse.data.choices[0].message.content;

  // Remove markdown formatting
  enhancedPrompt = enhancedPrompt
    .replace(/\*\*/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/Poster Generation Prompt:?/gi, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (enhancedPrompt.length > 350) {
    enhancedPrompt = enhancedPrompt.substring(0, 350);
  }

  // // Pollinations Image URL
  // const pollinationUrl =
  //     `https://image.pollinations.ai/prompt/${encodeURIComponent(
  //         enhancedPrompt
  //     )}?model=flux&width=1024&height=1024&seed=${Date.now()}&nologo=true`;

  const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    enhancedPrompt
  )}?model=flux&width=1024&height=1024&enhance=true&safe=false&seed=${Date.now()}`;

  // Create uploads/images folder if not exists
  const imageDir = path.join(__dirname, "../../uploads/images");

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, {
      recursive: true,
    });
  }

  // Image file name
  const fileName = `poster-${Date.now()}.png`;

  const filePath = path.join(imageDir, fileName);

  // Download image
  const imageResponse = await axios({
    url: pollinationUrl,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filePath);

  imageResponse.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);

    writer.on("error", reject);
  });

  return {
    enhancedPrompt,
    imageUrl: `/uploads/images/${fileName}`,
  };
};

module.exports = {
  generatePoster,
};
