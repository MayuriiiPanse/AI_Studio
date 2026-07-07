import api from "./client";

// GET /api/history/all
export function getAllHistory() {
  return api.get("/history/all").then((r) => r.data);
}

// GET /api/history/:type  (chat | image-analysis | poster | voice)
export function getHistoryByType(type) {
  return api.get(`/history/${type}`).then((r) => r.data);
}

// DELETE /api/history/:id
export function deleteHistory(id) {
  return api.delete(`/history/${id}`).then((r) => r.data);
}
