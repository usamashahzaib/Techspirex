import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const skipDirectories = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report"]);
const extensions = new Set([".css", ".js", ".md", ".mdx", ".mjs", ".ts", ".tsx"]);
const forbidden = /[\u2013\u2014]/u;
const failures = [];

function scan(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      if (!skipDirectories.has(entry)) scan(path);
    } else if (extensions.has(extname(entry))) {
      readFileSync(path, "utf8").split(/\r?\n/u).forEach((line, index) => {
        if (forbidden.test(line)) failures.push(`${relative(process.cwd(), path)}:${index + 1}`);
      });
    }
  }
}

scan(process.cwd());

if (failures.length) {
  console.error("Em and en dashes are forbidden. Use the plain ASCII hyphen (-).\n");
  console.error(failures.join("\n"));
  process.exit(1);
}
