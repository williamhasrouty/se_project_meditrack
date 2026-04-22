import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
/* eslint-disable no-undef */
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
  },
});
/* eslint-enable no-undef */
