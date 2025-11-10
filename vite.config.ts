import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        // This is your main React App
        main: resolve(__dirname, "index.html"),

        // This is your separate Widget page
        widget: resolve(__dirname, "widget/index.html"),
      },
    },
  },
});
