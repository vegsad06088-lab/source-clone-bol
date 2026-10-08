import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { sharedEnvLogin } from "./src/lib/auth/vite";
import { createGateway } from "./src/lib/ai-gateway/index.js";
import {
  activeProjectPlugin,
  getActiveProjectName,
  getProjectContentDir,
  getProjectConfigDir,
  getProjectTranslationsDir,
  getProjectPagesDir,
  PROJECTS_ROOT,
} from "./project-resolver";

// Scans the active project's content folder and exposes the file list as `virtual:content-manifest`.
// Drop photos into projects/<name>/content/ — galleries and the admin status tab pick them up automatically.
function contentManifest(): Plugin {
  const id = "virtual:content-manifest";
  const walk = (dir: string): string[] =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.startsWith(".") ? [] : [path.join(dir, e.name)],
        )
      : [];
  return {
    name: "content-manifest",
    resolveId: (s) => (s === id ? "\0" + id : null),
    load(s) {
      if (s !== "\0" + id) return null;
      const root = getProjectContentDir();
      const files = walk(root).map((f) => "/content/" + path.relative(root, f).split(path.sep).join("/"));
      return `export const contentFiles = ${JSON.stringify(files)};`;
    },
    configureServer(server) {
      const root = getProjectContentDir();
      server.watcher.add(root);
      const reload = (f: string) => {
        if (!f.startsWith(root)) return;
        const m = server.moduleGraph.getModuleById("\0" + id);
        if (m) server.moduleGraph.invalidateModule(m);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
  };
}

// LOCAL-ONLY config editor API used by /admin → "Einstellungen".
// Runs only in `npm run dev`; it does not exist in the published site.
// Reads and writes JSON files inside the active project's config/ and translations/ folders.
function configEditor(): Plugin {
  const configDir = () => getProjectConfigDir();
  const translationsDir = () => getProjectTranslationsDir();

  const list = () => {
    const cd = configDir();
    const td = translationsDir();
    const configFiles = fs.existsSync(cd)
      ? fs.readdirSync(cd).filter((f) => f.endsWith(".json")).map((f) => `config/${f}`)
      : [];
    const translationFiles = fs.existsSync(td)
      ? fs.readdirSync(td).filter((f) => f.endsWith(".json")).map((f) => `translations/${f}`)
      : [];
    return [...configFiles, ...translationFiles];
  };

  const resolveFile = (rel: string): string | null => {
    const allowed = list();
    if (!allowed.includes(rel)) return null;
    if (rel.startsWith("config/")) return path.resolve(configDir(), rel.slice("config/".length));
    if (rel.startsWith("translations/")) return path.resolve(translationsDir(), rel.slice("translations/".length));
    return null;
  };

  return {
    name: "config-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__config", (req, res) => {
        const url = new URL(req.url || "/", "http://x");
        const file = url.searchParams.get("file");
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        if (!file) return send(200, { files: list() });
        const abs = resolveFile(file);
        if (!abs) return send(403, { error: "File not allowed" });
        if (req.method === "GET") return send(200, { content: fs.readFileSync(abs, "utf8") });
        if (req.method === "POST") {
          let body = "";
          req.on("data", (c) => (body += c));
          req.on("end", () => {
            try {
              JSON.parse(body);
            } catch {
              return send(400, { error: "Invalid JSON" });
            }
            fs.writeFileSync(abs, body.endsWith("\n") ? body : body + "\n");
            send(200, { ok: true });
          });
          return;
        }
        send(405, { error: "Method not allowed" });
      });

      // Photos & PDFs in the active project's content folder: upload/replace (POST raw bytes) and delete (DELETE).
      const contentRoot = () => getProjectContentDir();
      const okExt = /\.(avif|jpe?g|png|webp|gif|svg|pdf)$/i;
      server.middlewares.use("/__content", (req, res) => {
        const url = new URL(req.url || "/", "http://x");
        const rel = (url.searchParams.get("path") || "").replace(/^\/+/, "");
        const cr = contentRoot();
        const abs = path.resolve(cr, rel);
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        if (!rel || !abs.startsWith(cr + path.sep) || !okExt.test(abs)) return send(403, { error: "Path not allowed" });
        if (req.method === "DELETE") {
          if (fs.existsSync(abs)) fs.unlinkSync(abs);
          return send(200, { ok: true });
        }
        if (req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => {
            const buf = Buffer.concat(chunks);
            if (!buf.length) return send(400, { error: "Empty file" });
            if (buf.length > 20 * 1024 * 1024) return send(413, { error: "File larger than 20 MB" });
            fs.mkdirSync(path.dirname(abs), { recursive: true });
            fs.writeFileSync(abs, buf);
            send(200, { ok: true, url: "/content/" + rel });
          });
          return;
        }
        send(405, { error: "Method not allowed" });
      });
    },
  };
}

// Serves the active project's content folder at /content/* in dev and preview.
function projectContentServer(): Plugin {
  return {
    name: "project-content-server",
    configureServer(server) {
      server.middlewares.use("/content", (req, res, next) => {
        const rel = (req.url || "").replace(/^\/+/, "");
        const abs = path.resolve(getProjectContentDir(), rel);
        const cr = getProjectContentDir();
        if (abs.startsWith(cr + path.sep) && fs.existsSync(abs) && fs.statSync(abs).isFile()) {
          return next();
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/content", (req, res, next) => {
        const rel = (req.url || "").replace(/^\/+/, "");
        const abs = path.resolve(getProjectContentDir(), rel);
        const cr = getProjectContentDir();
        if (abs.startsWith(cr + path.sep) && fs.existsSync(abs) && fs.statSync(abs).isFile()) {
          return next();
        }
        next();
      });
    },
  };
}

// LOCAL-ONLY AI proxy: calls the AI gateway server-side so the API key never reaches the browser.
function aiProxy(): Plugin {
  return {
    name: "ai-proxy",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__ai", async (req, res) => {
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        if (req.method !== "POST") return send(405, { error: "Method not allowed" });

        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", async () => {
          try {
            const { prompt, messages, systemPrompt, model, temperature, stream } = JSON.parse(body);
            const gateway = createGateway({});
            const result = await gateway.chat({
              prompt,
              messages,
              systemPrompt,
              model,
              temperature,
              maxTokens: 4000,
              stream: false,
            } as any);
            send(200, { text: (result as any).text, provider: (result as any).provider, model: (result as any).model });
          } catch (err: any) {
            send(502, { error: err?.message || "AI request failed" });
          }
        });
      });
    },
  };
}

// LOCAL-ONLY code editor: lets the admin AI write source files directly.
function codeEditor(): Plugin {
  const srcRoot = path.resolve(__dirname, "src");
  const protectedDirs = [path.resolve(srcRoot, "lib")];
  const okExt = /\.(tsx?|jsx?|json|css)$/i;

  return {
    name: "code-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__code", (req, res) => {
        const url = new URL(req.url || "/", "http://x");
        const file = (url.searchParams.get("file") || "").replace(/^\/+/, "");
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        const cookie = req.headers.cookie || "";
        if (!cookie.includes("sharedenv_session=")) return send(401, { error: "Not authenticated" });

        if (!file) return send(400, { error: "Missing file parameter" });
        const abs = path.resolve(srcRoot, file);
        if (!abs.startsWith(srcRoot + path.sep)) return send(403, { error: "Path outside src/" });
        if (protectedDirs.some((d) => abs.startsWith(d + path.sep))) return send(403, { error: "Protected directory" });
        if (!okExt.test(abs)) return send(403, { error: "File type not allowed" });

        if (req.method === "GET") {
          if (!fs.existsSync(abs)) return send(404, { error: "File not found" });
          return send(200, { content: fs.readFileSync(abs, "utf8") });
        }

        if (req.method === "POST") {
          let body = "";
          req.on("data", (c) => (body += c));
          req.on("end", () => {
            try {
              const { content } = JSON.parse(body);
              if (typeof content !== "string") return send(400, { error: "Missing content" });
              const backupPath = abs + ".bak";
              if (fs.existsSync(abs)) fs.copyFileSync(abs, backupPath);
              fs.mkdirSync(path.dirname(abs), { recursive: true });
              fs.writeFileSync(abs, content);
              send(200, { ok: true, file, backup: backupPath });
            } catch (err: any) {
              send(400, { error: err?.message || "Invalid request" });
            }
          });
          return;
        }

        if (req.method === "DELETE") {
          const backupPath = abs + ".bak";
          if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, abs);
            fs.unlinkSync(backupPath);
            return send(200, { ok: true, restored: true });
          }
          return send(404, { error: "No backup to restore" });
        }

        send(405, { error: "Method not allowed" });
      });
    },
  };
}

// Serves page JSONs from projects/<active>/pages/ at /__pages/* in dev.
// In production build, these are bundled as static JSON imports via the virtual manifest.
function pageServer(): Plugin {
  const pagesDir = () => getProjectPagesDir();

  const walkJson = (dir: string, base: string): string[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return walkJson(full, base);
      if (e.name.endsWith(".json")) return [path.relative(base, full).split(path.sep).join("/")];
      return [];
    });
  };

  return {
    name: "page-server",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__pages", (req, res) => {
        const url = new URL(req.url || "/", "http://x");
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        const pd = pagesDir();
        if (!fs.existsSync(pd)) return send(200, { pages: [], manifest: { pages: [], news: [], apartments: [], guides: [] } });

        // GET /__pages — return manifest (list of all page JSONs)
        if (req.method === "GET" && (!url.pathname || url.pathname === "/")) {
          const files = walkJson(pd, pd);
          const manifest: any = { pages: [], news: [], apartments: [], guides: [] };
          for (const f of files) {
            try {
              const data = JSON.parse(fs.readFileSync(path.join(pd, f), "utf8"));
              const visible = data.visible !== false;
              if (f.startsWith("news/")) {
                manifest.news.push({ id: data.id || f, visible, date: data.date || "" });
              } else if (f.startsWith("apartments/")) {
                manifest.apartments.push({ id: data.id || f, visible });
              } else if (f.startsWith("guides/")) {
                manifest.guides.push({ id: data.id || f, visible });
              } else {
                manifest.pages.push({ id: data.id || f.replace(/\.json$/, ""), visible, route: data.route || f.replace(/\.json$/, "") });
              }
            } catch {}
          }
          return send(200, { pages: files, manifest });
        }

        // GET /__pages?file=<path> — return a specific page JSON
        const file = url.searchParams.get("file");
        if (req.method === "GET" && file) {
          const abs = path.resolve(pd, file);
          if (!abs.startsWith(pd + path.sep)) return send(403, { error: "Path not allowed" });
          if (!fs.existsSync(abs)) return send(404, { error: "File not found" });
          return send(200, JSON.parse(fs.readFileSync(abs, "utf8")));
        }

        // POST /__pages?file=<path> — save a page JSON
        if (req.method === "POST" && file) {
          const abs = path.resolve(pd, file);
          if (!abs.startsWith(pd + path.sep)) return send(403, { error: "Path not allowed" });
          let body = "";
          req.on("data", (c) => (body += c));
          req.on("end", () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.lastChanged === undefined) parsed.lastChanged = new Date().toISOString();
              fs.mkdirSync(path.dirname(abs), { recursive: true });
              fs.writeFileSync(abs, JSON.stringify(parsed, null, 2) + "\n");
              send(200, { ok: true });
            } catch {
              send(400, { error: "Invalid JSON" });
            }
          });
          return;
        }

        send(405, { error: "Method not allowed" });
      });
    },
  };
}


// static build serves the right photos without any dev-server middleware.
function projectContentCopy(): Plugin {
  return {
    name: "project-content-copy",
    apply: "build",
    generateBundle() {
      const contentDir = getProjectContentDir();
      const dest = path.resolve(__dirname, "dist/content");
      if (!fs.existsSync(contentDir)) return;
      const walk = (dir: string, base: string) => {
        if (!fs.existsSync(dir)) return;
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          if (e.name.startsWith(".")) continue;
          const src = path.join(dir, e.name);
          const rel = path.relative(base, src);
          const target = path.join(dest, rel);
          if (e.isDirectory()) {
            fs.mkdirSync(target, { recursive: true });
            walk(src, base);
          } else {
            fs.mkdirSync(path.dirname(target), { recursive: true });
            fs.copyFileSync(src, target);
          }
        }
      };
      walk(contentDir, contentDir);

      // Also copy page JSONs to dist/__pages/ so the production build can fetch them
      const pagesDir = getProjectPagesDir();
      const pagesDest = path.resolve(__dirname, "dist/__pages");
      if (fs.existsSync(pagesDir)) {
        const walkPages = (dir: string, base: string) => {
          for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (e.name.startsWith(".")) continue;
            const src = path.join(dir, e.name);
            const rel = path.relative(base, src);
            const target = path.join(pagesDest, rel);
            if (e.isDirectory()) {
              fs.mkdirSync(target, { recursive: true });
              walkPages(src, base);
            } else {
              fs.mkdirSync(path.dirname(target), { recursive: true });
              fs.copyFileSync(src, target);
            }
          }
        };
        walkPages(pagesDir, pagesDir);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: "public",
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".", "projects"],
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    activeProjectPlugin(),
    contentManifest(),
    projectContentServer(),
    configEditor(),
    pageServer(),
    aiProxy(),
    codeEditor(),
    sharedEnvLogin(),
    react(),
    projectContentCopy(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
