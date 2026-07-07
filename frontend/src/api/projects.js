import api from "./client";

// POST /api/projects/create { projectName, description }
export function createProject(projectName, description) {
  return api.post("/projects/create", { projectName, description }).then((r) => r.data);
}

// GET /api/projects/all
export function getAllProjects() {
  return api.get("/projects/all").then((r) => r.data);
}

// GET /api/projects/:projectId
export function getProjectById(projectId) {
  return api.get(`/projects/${projectId}`).then((r) => r.data);
}

// POST /api/projects/:projectId/add-content { type, content }
export function addContentToProject(projectId, type, content) {
  return api.post(`/projects/${projectId}/add-content`, { type, content }).then((r) => r.data);
}

// PUT /api/projects/:projectId { projectName?, description? }
export function updateProject(projectId, fields) {
  return api.put(`/projects/${projectId}`, fields).then((r) => r.data);
}

// DELETE /api/projects/:projectId
export function deleteProject(projectId) {
  return api.delete(`/projects/${projectId}`).then((r) => r.data);
}
