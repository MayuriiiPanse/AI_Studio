const projectService = require(
    "../service/project.service"
);

const sendErrorResponse = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Something went wrong"
    });
};

const createProject = async (req, res) => {
    try {
        const { projectName, description } = req.body;

        if (!projectName || !projectName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required"
            });
        }

        const project = await projectService.createProject({
            user: req.user.id,
            projectName: projectName.trim(),
            description: description?.trim() || ""
        });

        res.status(201).json({
            success: true,
            project
        });

    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects(
            req.user.id
        );

        res.status(200).json({
            success: true,
            projects
        });

    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const addContentToProject = async (req, res) => {
    try {
        const { type, content } = req.body;

        if (!type || !String(type).trim()) {
            return res.status(400).json({
                success: false,
                message: "Content type is required"
            });
        }

        if (!content || !String(content).trim()) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const project = await projectService.addContentToProject(
            req.params.projectId,
            req.user.id,
            {
                type: String(type).trim(),
                content: String(content).trim()
            }
        );

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(
            req.params.projectId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const updateProject = async (req, res) => {
    try {
        const { projectName, description } = req.body;

        const updateData = {};

        if (projectName !== undefined) {
            if (!String(projectName).trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Project name cannot be empty"
                });
            }

            updateData.projectName = String(projectName).trim();
        }

        if (description !== undefined) {
            updateData.description = String(description).trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide projectName or description to update"
            });
        }

        const project = await projectService.updateProject(
            req.params.projectId,
            req.user.id,
            updateData
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const deleteProject = async (req, res) => {
    try {
        await projectService.deleteProject(
            req.params.projectId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        sendErrorResponse(res, error);
    }
};

module.exports = {
    createProject,
    getProjects,
    addContentToProject,
    getProjectById,
    updateProject,
    deleteProject
};