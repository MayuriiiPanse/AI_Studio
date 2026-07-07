import { io } from "socket.io-client";
import { API_ORIGIN } from "./client";

let socket = null;

// Lazily creates a single shared socket connection to the backend's
// Socket.IO server (mounted on the same HTTP server as the REST API).
export function getSocket() {
  if (!socket) {
    socket = io(API_ORIGIN, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}
