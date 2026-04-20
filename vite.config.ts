import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ws": {
        target: "https://b8d8-2401-4900-51e9-9ca6-95fa-5c37-2aea-d3ca.ngrok-free.app",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});