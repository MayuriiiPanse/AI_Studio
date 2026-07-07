import api from "./client";

// POST /api/rag/upload { title, text }
export function uploadRagDocument(title, text) {
  return api.post("/rag/upload", { title, text }).then((r) => r.data);
}

// POST /api/rag/search { query }
export function searchRagDocument(query) {
  return api.post("/rag/search", { query }).then((r) => r.data);
}
