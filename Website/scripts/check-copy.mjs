import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const roots = ["app", "components", "content", "features", "lib"];
const extensions = new Set([".css", ".md", ".mdx", ".ts", ".tsx"]);
const forbidden = /[\u2013\u2014]/u;
const failures = [];

function scan(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) scan(path);
    else if (extensions.has(extname(entry))) {
      readFileSync(path, "utf8").split(/\r?\n/u).forEach((line, index) => {
        if (forbidden.test(line)) failures.push(`${relative(process.cwd(), path)}:${index + 1}`);
      });
    }
  }
}

roots.filter(existsSync).forEach(scan);

if (failures.length) {
  console.error("Em and en dashes are forbidden. Use the plain ASCII hyphen (-).\n");
  console.error(failures.join("\n"));
  process.exit(1);
}
