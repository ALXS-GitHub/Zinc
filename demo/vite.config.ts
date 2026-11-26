import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@zinc\/ui\/(zinc|tokens|fonts)\.css$/, replacement: fileURLToPath(new URL("../src/styles/$1.css", import.meta.url)) },
      { find: /^@zinc\/ui\/shadcn\.css$/, replacement: fileURLToPath(new URL("../src/tailwind/shadcn.css", import.meta.url)) },
      { find: /^@zinc\/ui$/, replacement: fileURLToPath(new URL("../src/index.ts", import.meta.url)) },
    ],
  },
  build: { outDir: "dist", emptyOutDir: true },
});
