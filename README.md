# 🎫 TicketLab Lite: Hands-On with GitHub Copilot

A tiny ticket app (Node.js only, no framework, no cloud) built to practise:
**Copilot agent mode · custom instructions · MCP servers · Agent Skills**.

📊 **Presentation:** [Hands-On with GitHub Copilot](https://achrafbenalaya.github.io/Copilot-Parallel-DevSecOps-Malta/Copilot-Workshop_Deck_v3)

## Setup (2 minutes)

You need **Node.js 22+**, **VS Code**, and **GitHub Copilot** (agent mode).

```bash
git clone <this repo> && cd ticketlab-lite
npm install
npm start          # → http://localhost:3000
npm test           # 3 pass, 2 fail: that's expected 😉
```

## What's inside

| Path | What it is |
| --- | --- |
| `server.js`, `store.js`, `public/` | The app (~120 lines total) |
| `test/api.test.js` | 5 tests with the built-in `node:test` runner |
| `mcp/ticket-server.js` | **Our own MCP server**: `list_tickets`, `get_ticket`, `create_ticket` |
| `.vscode/mcp.json` | Registers the `ticketlab` MCP server + Playwright MCP |
| `.github/copilot-instructions.md` | House rules Copilot reads on every request |
| `.github/prompts/triage.prompt.md` | Reusable prompt → type `/triage` in chat |
| `.github/skills/release-check/` | An Agent Skill: run checks + write a report |

## The two bugs 🐛

1. **Search is case-sensitive**: `Login` finds 1 ticket, `LOGIN` finds 0. The tests catch it.
2. **The counter lies**: filter on *High* → 2 cards, but the header still says “6 tickets”.
   **The tests do NOT catch it.** You need eyes on the page (Playwright MCP).

## Exercises

1. **Agent mode**: ask Copilot to make `npm test` pass without touching the tests.
2. **MCP eyes**: start the app, then ask Copilot to use Playwright MCP to open
   `http://localhost:3000`, pick *High*, and compare the cards with the counter. Fix it.
3. **Your own MCP**: ask Copilot (in chat) “What high priority tickets are open?”, then
   “Create a ticket: counter shows wrong number, priority normal”. Refresh the app.
4. **Build a tool**: ask Copilot to add a `close_ticket` tool to `mcp/ticket-server.js`. Restart the server and try it.
5. **Two agents**: commit your fixes, run `npm run parallel`, open `../tl-counter` and `../tl-close` in two VS Code windows, and give each agent one task. Merge both branches.
6. **Skill**: ask “Is this ready to ship?” and watch the `release-check` skill kick in.

Stuck? Checkpoint branches: `checkpoint/1-search`, `checkpoint/2-counter`, `checkpoint/3-close-tool`, `solution`.
Start over: `npm run reset`.
