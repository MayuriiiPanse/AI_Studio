const mongoose = require("mongoose");
const Project = require("../models/project.model");

const validateProjectId = (projectId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        const error = new Error("Invalid project ID");
        error.statusCode = 400;
        throw error;
    }
};

const projectNotFoundError = () => {
    const error = new Error(
        "Project not found or you are not authorized"
    );
    error.statusCode = 404;
    return error;
};

const createProject = async (data) => {
    return await Project.create(data);
};

const getProjects = async (userId) => {
    return await Project.find({
        user: userId
    }).sort({
        createdAt: -1
    });
};

const addContentToProject = async (
    projectId,
    userId,
    contentData
) => {
    validateProjectId(projectId);

    const project = await Project.findOne({
        _id: projectId,
        user: userId
    });

    if (!project) {
        throw projectNotFoundError();
    }

    project.items.push(contentData);

    await project.save();

    return project;
};

const getProjectById = async (projectId, userId) => {
    validateProjectId(projectId);

    const project = await Project.findOne({
        _id: projectId,
        user: userId
    });

    if (!project) {
        throw projectNotFoundError();
    }

    return project;
};

const updateProject = async (
    projectId,
    userId,
    updateData
) => {
    validateProjectId(projectId);

    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            user: userId
        },
        updateData,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    if (!project) {
        throw projectNotFoundError();
    }

    return project;
};

const deleteProject = async (projectId, userId) => {
    validateProjectId(projectId);

    const project = await Project.findOneAndDelete({
        _id: projectId,
        user: userId
    });

    if (!project) {
        throw projectNotFoundError();
    }

    return project;
};

module.exports = {
    createProject,
    getProjects,
    addContentToProject,
    getProjectById,
    updateProject,
    deleteProject
};
