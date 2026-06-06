#!/usr/bin/env node
/**
 * Lightweight dependency-boundary enforcement (ADR 0001/0002 layering).
 *
 * Deliberately a standalone script rather than ESLint/Turborepo boundary
 * plugins — keeps enforcement simple and avoids tool-interaction loops while
 * there is little to guard. Run with `pnpm check-deps`.
 *
 * Rules (dependencies point downward only):
 *   app          -> application, function, platform, sdk, models, core
 *   application  -> function, platform, sdk, models, core      (not application)
 *   function     -> platform, sdk, models, core                (not function)
 *   sdk          -> models, core
 *   platform     -> platform, models, core
 *   core         -> models
 *   models       -> (nothing internal)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED = {
  app: ["application", "function", "platform", "sdk", "models", "core"],
  application: ["function", "platform", "sdk", "models", "core"],
  function: ["platform", "sdk", "models", "core"],
  sdk: ["models", "core"],
  platform: ["platform", "models", "core"],
  core: ["models"],
  models: [],
};

function layerOf(name, dir) {
  if (dir.startsWith("apps/")) return "app";
  if (name === "@aegis/models") return "models";
  if (name.startsWith("@aegis/core")) return "core";
  if (name.startsWith("@aegis/sdk-")) return "sdk";
  if (name.startsWith("@aegis/platform-")) return "platform";
  if (name.startsWith("@aegis/function-")) return "function";
  if (name.startsWith("@aegis/app-")) return "application";
  return "unknown";
}

function pkgDirs() {
  const globs = ["apps", "packages", "packages/functions", "packages/applications"];
  const dirs = [];
  for (const g of globs) {
    const abs = join(ROOT, g);
    if (!existsSync(abs)) continue;
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const rel = `${g}/${entry.name}`;
      if (existsSync(join(ROOT, rel, "package.json"))) dirs.push(rel);
    }
  }
  return dirs;
}

const violations = [];
let checked = 0;

for (const dir of pkgDirs()) {
  const pkg = JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8"));
  const layer = layerOf(pkg.name, dir);
  if (layer === "unknown") continue;
  const allowed = ALLOWED[layer] ?? [];
  const deps = { ...pkg.dependencies, ...pkg.peerDependencies };
  checked += 1;

  for (const dep of Object.keys(deps)) {
    if (!dep.startsWith("@aegis/")) continue;
    const depLayer = layerOf(dep, "packages/x");
    if (!allowed.includes(depLayer)) {
      violations.push(
        `${pkg.name} (${layer}) must not depend on ${dep} (${depLayer})`,
      );
    }
  }
}

if (violations.length > 0) {
  console.error(`✗ dependency-boundary violations (${violations.length}):`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log(`✓ dependency boundaries OK (${checked} packages checked)`);
