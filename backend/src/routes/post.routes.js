const express = require("express");
const multer = require("multer");

const {
    createPostController,
    getAllPostsController,
    getPostByIdController,
    getCaptionController,
    getHashtagsController,
    getStoryController,
    getMoodController,
    getReelScriptController,
    getViralHookController,
    getPromptController,
    updatePostController,
    deletePostController
} = require("../controller/postController.js");

const authMiddleware = require(
    "../middlewares/auth.middleware.js"
);

const prouter = express.Router();

const upload = multer({
    dest: "uploads/"
});

// CREATE POST WITH IMAGE + AI ANALYSIS
prouter.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    createPostController
);

// GET ALL POSTS OF LOGGED-IN USER
// Must be before "/:id"
prouter.get(
    "/all",
    authMiddleware,
    getAllPostsController
);

// GET FULL POST
prouter.get(
    "/:id",
    authMiddleware,
    getPostByIdController
);

// UPDATE POST CONTENT
prouter.put(
    "/:id",
    authMiddleware,
    updatePostController
);

// DELETE POST
prouter.delete(
    "/:id",
    authMiddleware,
    deletePostController
);

// GET CAPTION
prouter.get(
    "/:id/caption",
    authMiddleware,
    getCaptionController
);

// GET HASHTAGS
prouter.get(
    "/:id/hashtags",
    authMiddleware,
    getHashtagsController
);

// GET STORY
prouter.get(
    "/:id/story",
    authMiddleware,
    getStoryController
);

// GET MOOD
prouter.get(
    "/:id/mood",
    authMiddleware,
    getMoodController
);

// GET REEL SCRIPT
prouter.get(
    "/:id/reel-script",
    authMiddleware,
    getReelScriptController
);

// GET VIRAL HOOK
prouter.get(
    "/:id/viral-hook",
    authMiddleware,
    getViralHookController
);

// GET AI PROMPT
prouter.get(
    "/:id/prompt",
    authMiddleware,
    getPromptController
);

module.exports = prouter;