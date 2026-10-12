import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import scrapeHandler from "./api/scrape.js";
import fixturesHandler from "./api/fixtures.js";

// Emulates Vercel's serverless function routing locally so `npm run dev`
// can hit /api/* routes without deploying.
function localApiPlugin() {
  const routes = {
    "/api/scrape": scrapeHandler,
    "/api/fixtures": fixturesHandler,
  };
  return {
    name: "local-api-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        const handler = routes[url.pathname];
        if (!handler) return next();

        req.query = Object.fromEntries(url.searchParams);
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        };
        await handler(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 5173
  }
});
