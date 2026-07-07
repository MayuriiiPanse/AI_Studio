import api from "./client";

// POST /api/auth/register  { username, password } -> { success, token, user }
export function register(username, password) {
  return api.post("/auth/register", { username, password }).then((r) => r.data);
}

// POST /api/auth/login  { username, password } -> { success, token, user }
export function login(username, password) {
  return api.post("/auth/login", { username, password }).then((r) => r.data);
}
