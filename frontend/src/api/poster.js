import api from "./client";

// POST /api/poster/generate { prompt } -> { poster, enhancedPrompt }
export function generatePoster(prompt) {
  return api.post("/poster/generate", { prompt }).then((r) => r.data);
}

// GET /api/poster/all -> { posters }
export function getAllPosters() {
  return api.get("/poster/all").then((r) => r.data);
}

// DELETE /api/poster/:id
export function deletePoster(id) {
  return api.delete(`/poster/${id}`).then((r) => r.data);
}
