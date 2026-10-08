/**
 * Active project resolver — reads projects/active-project.json at build time
 * and exposes the project name + filesystem path via a virtual module.
 *
 * The rest of the app imports `activeProject` from here to know which
 * folder under projects/ holds all config, translations, and content.
 */
import fs from "fs";
import path from "path";
import { type Plugin } from "vite";

const PROJECTS_DIR = path.resolve(__dirname, "projects");
const ACTIVE_FILE = path.join(PROJECTS_DIR, "active-project.json");

function readActiveProject(): string {
  const raw = JSON.parse(fs.readFileSync(ACTIVE_FILE, "utf8")) as { active: string };
  return raw.active;
}

/** Virtual module: `virtual:active-project` → { name, dir, contentDir } */
export function activeProjectPlugin(): Plugin {
  const id = "virtual:active-project";
  let projectName = readActiveProject();

  return {
    name: "active-project",
    resolveId(s) {
      if (s === id) return "\0" + id;
      return null;
    },
    load(s) {
      if (s !== "\0" + id) return null;
      projectName = readActiveProject();
      const projectDir = path.join(PROJECTS_DIR, projectName);
      return `export const projectName = ${JSON.stringify(projectName)};\nexport const projectDir = ${JSON.stringify(projectDir)};\n`;
    },
    configureServer(server) {
      server.watcher.add(ACTIVE_FILE);
      const reload = (f: string) => {
        if (f !== ACTIVE_FILE) return;
        const m = server.moduleGraph.getModuleById("\0" + id);
        if (m) server.moduleGraph.invalidateModule(m);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("change", reload);
    },
  };
}

// Re-export for use in other plugins
export function getActiveProjectName(): string {
  return readActiveProject();
}

export function getProjectDir(): string {
  return path.join(PROJECTS_DIR, readActiveProject());
}

export function getProjectContentDir(): string {
  return path.join(getProjectDir(), "content");
}

export function getProjectConfigDir(): string {
  return path.join(getProjectDir(), "config");
}

export function getProjectTranslationsDir(): string {
  return path.join(getProjectDir(), "translations");
}

export function getProjectPagesDir(): string {
  return path.join(getProjectDir(), "pages");
}

export function getProjectNewsDir(): string {
  return path.join(getProjectDir(), "pages", "news");
}

export const PROJECTS_ROOT = PROJECTS_DIR;
