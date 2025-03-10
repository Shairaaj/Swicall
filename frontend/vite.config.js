import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set the backend API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://swicall.onrender.com"
    : "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["styled-components"], // Add this if styled-components is causing issues
    },
  },
  server: {
    proxy: {
      "/privacy": {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      },
    },
  },
});
