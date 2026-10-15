// Creates two git worktrees so two Copilot agents can work at the same time.
//   ../tl-counter  (branch agent/counter)     → fixes the counter bug, app on port 3001
//   ../tl-close    (branch agent/close-tool)  → adds the close_ticket MCP tool
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const run = (cmd, cwd) => { console.log(`$ ${cmd}`); execSync(cmd, { stdio: "inherit", cwd }); };

if (execSync("git status --porcelain", { encoding: "utf8" }).trim()) {
  console.error("Commit your changes first (git commit -am \"...\"), then run me again.");
  process.exit(1);
}

for (const [dir, branch] of [["../tl-counter", "agent/counter"], ["../tl-close", "agent/close-tool"]]) {
  if (existsSync(dir)) { console.log(`${dir} already exists, skipping`); continue; }
  run(`git worktree add ${dir} -b ${branch}`);
  run("npm install --prefer-offline --no-audit --no-fund", dir);
}
console.log("\nReady! Open each folder in its own VS Code window:\n  code ../tl-counter\n  code ../tl-close");
