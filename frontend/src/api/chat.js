import api from "./client";

// POST /api/chat/ai { message } -> { chat }
export function sendChatMessage(message) {
  return api.post("/chat/ai", { message }).then((r) => r.data);
}
