const path = require("path");
const fs = require("fs");


const Poster = require("../models/poster.model");

const posterService = require("../service/poster.service");

const historyService = require("../service/history.service");

const generatePoster = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,

        message: "Prompt is required",
      });
    }

    const result = await posterService.generatePoster(prompt);

    const poster = await Poster.create({
      user: req.user._id,

      prompt,

      imageUrl: result.imageUrl,
    });

    await historyService.saveHistory({
      user: req.user._id,

      type: "poster",

      data: {
        prompt,

        enhancedPrompt: result.enhancedPrompt,

        imageUrl: result.imageUrl,
      },
    });

    res.status(201).json({
      success: true,

      message: "Poster generated successfully",

      poster,

      enhancedPrompt: result.enhancedPrompt,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const getAllPosters = async (req, res) => {
  try {
    const posters = await Poster.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      posters,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const deletePoster = async (req, res) => {
    try {

        console.log("Poster ID:", req.params.id);
        console.log("Logged User:", req.user);

        const poster = await Poster.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        console.log("Found Poster:", poster);

        if (!poster) {
            return res.status(404).json({
                success: false,
                message: "Poster not found"
            });
        }

        const imagePath = path.join(
            __dirname,
            "../../",
            poster.imageUrl.replace(/^\/+/, "")
        );

        console.log("Deleting image:", imagePath);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Poster.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Poster deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
  generatePoster,
  getAllPosters,
  deletePoster,
};
