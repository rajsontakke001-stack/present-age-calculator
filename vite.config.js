import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the built app works from any subpath —
  // a GitHub Pages project site (username.github.io/repo/),
  // a Vercel/Netlify root domain, or a plain static file server.
  base: "./",
});
