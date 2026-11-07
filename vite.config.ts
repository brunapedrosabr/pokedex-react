/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Porta do servidor da IA (server/index.js). Precisa ser a mesma usada lá.
const API_PORT = Number(process.env.API_PORT ?? 3001);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Durante o desenvolvimento, tudo que começa com /api vai para o servidor da IA.
    proxy: {
      "/api": `http://localhost:${API_PORT}`,
    },
  },
  preview: {
    port: 4173,
    proxy: {
      "/api": `http://localhost:${API_PORT}`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
