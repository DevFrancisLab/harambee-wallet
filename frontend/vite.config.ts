import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // use port 5173 so that `npm run dev` launches on the expected Vite default
    port: 5173,
    hmr: { overlay: false },
  },
  plugins: [
  react(),
  // removed lovable-tagger plugin, not needed anymore
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Harambee Wallet",
        short_name: "Harambee",
        description: "Transparent community fundraising platform",
        theme_color: "#1D4ED8",
        background_color: "#F7F4ED",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
