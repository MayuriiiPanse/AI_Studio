const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const ragController = require("../controller/ragController");

router.post(
    "/upload",
    authMiddleware,
    ragController.uploadRagDocument
);

router.post(
    "/search",
    authMiddleware,
    ragController.searchRagDocument
);

module.exports = router;