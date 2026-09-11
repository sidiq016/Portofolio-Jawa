import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // In-memory database for portfolio data
  let portfolioData = {
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    wallpaperUrl: "",
    bio: "Nama saya Firman. Saya adalah seorang Full-Stack Developer yang antusias dalam membangun pengalaman digital yang interaktif dan modern.",
    github: "https://github.com/",
    ig: "https://instagram.com/",
    projects: [
      { id: "1", title: "Project Alpha", desc: "Deskripsi project pertama." }
    ]
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/portfolio", (req, res) => {
    res.json(portfolioData);
  });

  app.post("/api/portfolio", (req, res) => {
    portfolioData = { ...portfolioData, ...req.body };
    res.json({ success: true, data: portfolioData });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
