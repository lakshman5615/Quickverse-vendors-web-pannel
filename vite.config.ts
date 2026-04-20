import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  define: {
    global: "window",
  },
  server: {
    proxy: {
      "/ws": {
        target: "https://bde9-2409-4081-8786-c108-8db4-cd35-de04-c31.ngrok-free.app",
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