import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
});

// ── Request interceptor: attach JWT token ─────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("reforge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ─────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("reforge_token");
      localStorage.removeItem("reforge_email");
      // Only redirect if not already on the auth page
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────

export async function signup(email, password) {
  const response = await client.post("/auth/signup", { email, password });
  return response.data;
}

export async function login(email, password) {
  const response = await client.post("/auth/login", { email, password });
  return response.data;
}

export async function getMe() {
  const response = await client.get("/auth/me");
  return response.data;
}

// ── App endpoints ─────────────────────────────────────────────

export async function analyzeItem(imageFile, skillLevel, signal) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("skill_level", skillLevel);

  const response = await client.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    signal,
  });

  return response.data;
}

export async function sendFeedback(source, id, title, tags, vote) {
  const response = await client.post("/feedback", { source, id, title, tags, vote });
  return response.data;
}