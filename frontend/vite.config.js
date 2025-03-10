import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Ensure Vite's environment variable is defined
const mode = process.env.NODE_ENV || "development"; // Fallback if import.meta.env is undefined

const API_BASE_URL =
  mode === "production"
    ? "https://swicall.onrender.com"
    : "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(API_BASE_URL),
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
