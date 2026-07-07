const gTTS = require("gtts");
const path = require("path");
const fs = require("fs");

const generateVoice = async (text) => {

    const audioDir = path.join(
        __dirname,
        "../../uploads/audio"
    );

    // Create uploads/audio folder if it doesn't exist
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, {
            recursive: true
        });
    }

    const fileName = `voice-${Date.now()}.mp3`;

    const outputPath = path.join(
        audioDir,
        fileName
    );

    return new Promise((resolve, reject) => {

        const gtts = new gTTS(text, "en");

        gtts.save(outputPath, (err) => {

            if (err) {
                return reject(err);
            }

            resolve(`/uploads/audio/${fileName}`);

        });

    });

};

module.exports = {
    generateVoice
};