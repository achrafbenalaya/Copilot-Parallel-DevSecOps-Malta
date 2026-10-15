// Back to the starting point: removes the worktrees and agent branches, resets main.
import { execSync } from "node:child_process";
const sh = (c) => { try { execSync(c, { stdio: "ignore" }); console.log("✓ " + c); } catch {} };
sh("git worktree remove --force ../tl-counter");
sh("git worktree remove --force ../tl-close");
sh("git checkout -f main");
sh("git reset --hard workshop-start");
sh("git branch -D agent/counter agent/close-tool");
sh("git clean -fd");
console.log("Reset done. npm test should show 3 pass / 2 fail.");
