const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/auth.middleware");

const posterController =
require("../controller/posterController");

router.post(
    "/generate",
    authMiddleware,
    posterController.generatePoster
);

router.get(
    "/all",
    authMiddleware,
    posterController.getAllPosters
);

router.delete(
    "/:id",
    authMiddleware,
    posterController.deletePoster
);

module.exports = router;