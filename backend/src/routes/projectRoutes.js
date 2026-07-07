const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const projectController = require("../controller/projectController");



router.post(
    "/create",
    authMiddleware,
    projectController.createProject
);

router.get(
    "/all",
    authMiddleware,
    projectController.getProjects
);

router.post(
    "/:projectId/add-content",
    authMiddleware,
    projectController.addContentToProject
);

router.get(
    "/:projectId",
    authMiddleware,
    projectController.getProjectById
);

router.delete(
    "/:projectId",
    authMiddleware,
    projectController.deleteProject
);

router.put(
    "/:projectId",
    authMiddleware,
    projectController.updateProject
);

module.exports = router;