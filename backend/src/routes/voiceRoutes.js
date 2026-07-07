const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middlewares/auth.middleware");

const voiceController =
require("../controller/voiceController");

router.post(
    "/generate",
    authMiddleware,
    voiceController.generateVoice
);

router.get(
    "/all",
    authMiddleware,
    voiceController.getAllVoices
);

module.exports = router;