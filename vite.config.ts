import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    define: {
      global: "window",
    },
    server: {
      host: "0.0.0.0",   // 👈 force external access
      port: 5173,
      strictPort: true,

      allowedHosts: [
        "heroics-engraved-destruct.ngrok-free.dev"
      ],

      origin: "http://prd.quickverse.in/", // 👈 KEY FIX

      proxy: {
        
        "/ws": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      },
    },
  };
});