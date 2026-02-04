import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const httpBase = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request interceptor: attach token from Zustand globally ---
httpBase.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- Response interceptor: handle 401 globally ---
let isRedirecting = false; // ensures single redirect

httpBase.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;

      // Clear auth globally
      useAuthStore.getState().logout();

      // Optional: toast message
      // toast.error("Session expired. Please log in again.");

      // Redirect once
      // window.location.replace("/auth/login");
    }

    return Promise.reject(error);
  }
);

export default httpBase;
