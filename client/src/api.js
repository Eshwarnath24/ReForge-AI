import axios from "axios";
import { getToken, clearAuth } from "./auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export async function signup(email, password) {
  const response = await client.post("/auth/signup", { email, password });
  return response.data;
}

export async function login(email, password) {
  const response = await client.post("/auth/login", { email, password });
  return response.data;
}

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
  const response = await client.post("/feedback", {
    source,
    id,
    title,
    tags,
    vote,
  });
  return response.data;
}