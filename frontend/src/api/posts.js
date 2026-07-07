import api from "./client";

// POST /api/posts/create  (multipart: image) -> { post }
export function createPost(file, onUploadProgress) {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post("/posts/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    })
    .then((r) => r.data);
}

// GET /api/posts/all -> { posts }
export function getAllPosts() {
  return api.get("/posts/all").then((r) => r.data);
}

// GET /api/posts/:id -> { post }
export function getPostById(id) {
  return api.get(`/posts/${id}`).then((r) => r.data);
}

// PUT /api/posts/:id  (any of caption, hashtags, mood, story, reelScript, viralHook, aiPrompt)
export function updatePost(id, fields) {
  return api.put(`/posts/${id}`, fields).then((r) => r.data);
}

// DELETE /api/posts/:id
export function deletePost(id) {
  return api.delete(`/posts/${id}`).then((r) => r.data);
}
