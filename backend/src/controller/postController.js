const uploadFile = require("../service/storage.service.js");
const generateAIContent = require("../service/ai.service.js");
const postModel = require("../models/post.model.js");
const historyService = require("../service/history.service");
const ragService = require("../service/rag.service");

const fs = require("fs");
const mongoose = require("mongoose");

const isValidPostId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getOwnedPost = async (postId, userId) => {
  if (!isValidPostId(postId)) {
    const error = new Error("Invalid post ID");
    error.statusCode = 400;
    throw error;
  }

  const post = await postModel.findOne({
    _id: postId,
    user: userId,
  });

  if (!post) {
    const error = new Error("Post not found or you are not authorized");
    error.statusCode = 404;
    throw error;
  }

  return post;
};

const sendError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || fallbackMessage,
  });
};

async function createPostController(req, res) {
  let localFilePath = null;

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    localFilePath = file.path;

    // Upload image to Cloudinary
    const result = await uploadFile(file.path);

    // Generate AI content based on uploaded image
    const aiData = await generateAIContent(result.secure_url);

    // Save generated post
    const post = await postModel.create({
      image: result.secure_url,
      caption: aiData.caption || "",
      hashtags: aiData.hashtags || [],
      mood: aiData.mood || "",
      story: aiData.story || "",
      reelScript: aiData.reelScript || "",
      viralHook: aiData.viralHook || "",
      aiPrompt: aiData.aiPrompt || "",
      user: req.user._id,
    });

    const ragData = await ragService.uploadToPinecone({
      userId: req.user._id.toString(),

      title: `Post ${post._id}`,

      type: "post",

      text: `
Caption:
${post.caption}

Story:
${post.story}

Mood:
${post.mood}

Hashtags:
${post.hashtags.join(", ")}

Reel Script:
${post.reelScript}

Viral Hook:
${post.viralHook}

AI Prompt:
${post.aiPrompt}
`,
    });

    post.ragVectorId = ragData.vectorId;

    await post.save();

    // Save to history
    await historyService.saveHistory({
      user: req.user._id,
      type: "image-analysis",
      data: {
        postId: post._id,
        image: post.image,
        caption: post.caption,
        hashtags: post.hashtags,
        mood: post.mood,
        story: post.story,
        reelScript: post.reelScript,
        viralHook: post.viralHook,
        aiPrompt: post.aiPrompt,
      },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log("CREATE POST ERROR:", error.message);

    sendError(res, error, "Upload failed");
  } finally {
    // Local Multer file should always be removed,
    // whether upload succeeds or fails.
    deleteLocalFile(localFilePath);
  }
}

async function getAllPostsController(req, res) {
  try {
    const posts = await postModel
      .find({
        user: req.user._id,
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log("GET ALL POSTS ERROR:", error.message);

    sendError(res, error, "Failed to fetch posts");
  }
}

async function getPostByIdController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log("GET POST ERROR:", error.message);

    sendError(res, error, "Failed to fetch post");
  }
}

async function getCaptionController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      caption: post.caption,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch caption");
  }
}

async function getHashtagsController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      hashtags: post.hashtags,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch hashtags");
  }
}

async function getStoryController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      story: post.story,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch story");
  }
}

async function getMoodController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      mood: post.mood,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch mood");
  }
}

async function getReelScriptController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      reelScript: post.reelScript,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch reel script");
  }
}

async function getViralHookController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      viralHook: post.viralHook,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch viral hook");
  }
}

async function getPromptController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      aiPrompt: post.aiPrompt,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch prompt");
  }
}

async function updatePostController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);

    const allowedFields = [
      "caption",
      "hashtags",
      "mood",
      "story",
      "reelScript",
      "viralHook",
      "aiPrompt",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid post fields provided to update",
      });
    }

    if (
      updateData.hashtags !== undefined &&
      !Array.isArray(updateData.hashtags)
    ) {
      return res.status(400).json({
        success: false,
        message: "hashtags must be an array",
      });
    }

    Object.assign(post, updateData);

    await post.save();

    await historyService.saveHistory({
      user: req.user._id,
      // type: "post-update"
      type: "image-analysis",
      data: {
        postId: post._id,
        image: post.image,
        caption: post.caption,
        hashtags: post.hashtags,
        mood: post.mood,
        story: post.story,
        reelScript: post.reelScript,
        viralHook: post.viralHook,
        aiPrompt: post.aiPrompt,
      },
    });

    //     await ragService.uploadToPinecone({
    //     userId: req.user._id.toString(),
    //     title: `Post ${post._id}`,
    //     text: `
    // Caption:
    // ${post.caption}

    // Story:
    // ${post.story}

    // Mood:
    // ${post.mood}

    // Hashtags:
    // ${post.hashtags.join(", ")}

    // Reel Script:
    // ${post.reelScript}

    // Viral Hook:
    // ${post.viralHook}

    // AI Prompt:
    // ${post.aiPrompt}
    // `
    // });

    const ragData = await ragService.uploadToPinecone({
      userId: req.user._id.toString(),

      title: `Post ${post._id}`,

      type: "post",

      text: `
Caption:
${post.caption}

Story:
${post.story}

Mood:
${post.mood}

Hashtags:
${post.hashtags.join(", ")}

Reel Script:
${post.reelScript}

Viral Hook:
${post.viralHook}

AI Prompt:
${post.aiPrompt}
`,
    });

    post.ragVectorId = ragData.vectorId;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log("UPDATE POST ERROR:", error);

    sendError(res, error, "Failed to update post");
  }
}

async function deletePostController(req, res) {
  try {
    const post = await getOwnedPost(req.params.id, req.user._id);
    //    await ragService.deleteKnowledge(
    //    post._id.toString(),
    //    req.user._id.toString()
    //  );
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("DELETE POST ERROR:", error);

    sendError(res, error, "Failed to delete post");
  }
}

module.exports = {
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
  deletePostController,
};
