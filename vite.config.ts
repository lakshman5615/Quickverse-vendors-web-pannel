import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ws": {
        target: "https://e0b1-2409-4081-8786-c108-8db4-cd35-de04-c31.ngrok-free.app",
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