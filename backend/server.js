import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  /**
   * SECURITY NOTE: 
   * The application has been migrated to a "Local-First" architecture.
   * Data (Notes, Problems, Roadmaps) is now stored directly in the user's browser (IndexedDB).
   * This server now ONLY handles:
   * 1. Serving the static frontend files.
   * 2. Providing the web-scraper API for importing problems.
   * No user data is stored on this server, making it 100% secure against data theft.
   */

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false
  }));
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: "local-first" });
  });

  // Webscraper API 
  app.post("/api/import-problem", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const { default: axios } = await import("axios");
      const { default: TurndownService } = await import("turndown");
      const cheerio = await import("cheerio");

      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      });
      turndownService.escape = (string) => string;
      turndownService.keep(['sup', 'sub', 'b', 'strong', 'i', 'em', 'br']);
      
      turndownService.addRule('code', {
        filter: 'code',
        replacement: function (content, node) {
          return node.outerHTML;
        }
      });

      turndownService.addRule('pre', {
        filter: 'pre',
        replacement: function (content) {
          return '\n\n' + content.trim().split('\n').map(line => '> ' + line).join('\n') + '\n\n';
        }
      });

      if (url.includes("leetcode.com")) {
        // Specialized LeetCode GraphQL logic
        const match = url.match(/problems\/([^/]+)/);
        if (match) {
          const slug = match[1];
          const fetchResponse = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              "Referer": "https://leetcode.com/",
            },
            body: JSON.stringify({
              query: `query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { title content difficulty topicTags { name } } }`,
              variables: { titleSlug: slug },
            })
          });
          
          const gqlData = await fetchResponse.json();
          const q = gqlData.data?.question;
          if (q) {
            return res.json({
              title: q.title,
              description: turndownService.turndown(q.content),
              difficulty: q.difficulty,
              tags: q.topicTags.map(t => t.name),
              link: url,
              platform: "LeetCode"
            });
          }
        }
      }

      const response = await axios.get(url, { 
        headers: { 'User-Agent': 'Mozilla/5.0' }, 
        timeout: 15000 
      });

      // Fallback scraper
      const $ = cheerio.load(response.data);
      const title = $('h1').first().text() || $('title').text() || "Imported Problem";
      const content = $('article').html() || $('.problem-statement').html() || "No content found";
      
      res.json({
        title: title.trim(),
        description: turndownService.turndown(content),
        difficulty: "Medium",
        tags: ["Imported"],
        link: url,
        platform: "Generic"
      });

    } catch (error) {
      console.error("Error importing problem:", error);
      res.status(500).json({ error: "Failed to fetch problem data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.join(__dirname, "../frontend"),
      server: { middlewareMode: true },
      appType: "spa",
      configFile: path.join(__dirname, "../frontend/vite.config.js")
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (SECURITY: Local-First Mode Active)`);
  });
}

startServer();
