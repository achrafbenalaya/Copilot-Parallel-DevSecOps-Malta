// Runs the tests + a smoke check on the real server, then writes release-report.md
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { startServer } from "../server.js";

const lines = [`# Release report`, ``, `Date: ${new Date().toISOString()}`, ``];
let ok = true;

// 1. Unit tests
try {
  const out = execSync("node --test", { encoding: "utf8", stdio: "pipe" });
  const pass = out.match(/# pass (\d+)/)?.[1], fail = out.match(/# fail (\d+)/)?.[1];
  lines.push(`- ✅ Tests: ${pass} passed, ${fail} failed`);
} catch (e) {
  ok = false;
  const out = e.stdout ?? "";
  lines.push(`- ❌ Tests: ${out.match(/# pass (\d+)/)?.[1]} passed, ${out.match(/# fail (\d+)/)?.[1]} failed`);
}

// 2. Smoke check: home page and API answer
const server = await startServer(0);
const base = `http://localhost:${server.address().port}`;
const home = await fetch(base);
const api = await (await fetch(base + "/api/tickets")).json();
server.close();
const smoke = home.ok && Array.isArray(api) && api.length > 0;
if (!smoke) ok = false;
lines.push(`- ${smoke ? "✅" : "❌"} Smoke: home page ${home.status}, API returned ${api.length} tickets`);

lines.push("", ok ? "**Verdict: ready to ship** 🚀" : "**Verdict: NOT ready** 🛑");
writeFileSync("release-report.md", lines.join("\n") + "\n");
console.log(lines.join("\n"));
process.exit(ok ? 0 : 1);
