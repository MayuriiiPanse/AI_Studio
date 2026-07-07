const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middlewares/auth.middleware");

const historyController =
require("../controller/historyController");

router.get(
    "/all",
    authMiddleware,
    historyController.getHistory
);

router.get(
    "/:type",
    authMiddleware,
    historyController.getHistoryByType
);

router.delete(
    "/:id",
    authMiddleware,
    historyController.deleteHistory
);

module.exports = router;