import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname } from "node:path";
import { findTickets, addTicket } from "./store.js";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

export function startServer(port = Number(process.env.PORT) || 3000) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname === "/api/tickets" && req.method === "GET") {
      const tickets = findTickets({
        priority: url.searchParams.get("priority") ?? undefined,
        q: url.searchParams.get("q") ?? undefined,
      });
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify(tickets));
    }

    if (url.pathname === "/api/tickets" && req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        const { title, priority } = JSON.parse(body || "{}");
        if (!title) { res.writeHead(400); return res.end("title is required"); }
        res.writeHead(201, { "content-type": "application/json" });
        res.end(JSON.stringify(addTicket({ title, priority })));
      });
      return;
    }

    const file = new URL("./public" + (url.pathname === "/" ? "/index.html" : url.pathname), import.meta.url);
    if (existsSync(file)) {
      res.writeHead(200, { "content-type": TYPES[extname(file.pathname)] ?? "text/plain" });
      return res.end(readFileSync(file));
    }
    res.writeHead(404); res.end("not found");
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("server.js")) {
  const s = await startServer();
  console.log(`TicketLab Lite running on http://localhost:${s.address().port}`);
}
