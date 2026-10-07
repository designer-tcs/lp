import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "/admission/",
    plugins: [
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({
        pages: [
          { path: "/" },
          { path: "/top-cbse-school-sarjapura-bengaluru" },
          { path: "/top-cbse-school-sarjapura-bengaluru/v2" },
          { path: "/top-cbse-school-sarjapura-bengaluru/thank-you" },
          { path: "/best-cbse-school-sarjapura-bengaluru" },
          { path: "/best-cbse-school-sarjapura-bengaluru/v2" },
          { path: "/best-cbse-school-sarjapura-bengaluru/thank-you" },
        ],
        prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false },
      }),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      viteReact(),
    ],

    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },

    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/leads": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
});
