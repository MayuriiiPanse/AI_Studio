import api from "./client";

// POST /api/voice/generate { text } -> { voice }
export function generateVoice(text) {
  return api.post("/voice/generate", { text }).then((r) => r.data);
}

// GET /api/voice/all -> { voices }
export function getAllVoices() {
  return api.get("/voice/all").then((r) => r.data);
}
