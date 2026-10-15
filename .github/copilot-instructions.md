# TicketLab Lite: how to work in this repo

- Plain Node.js 22, ES modules, no frameworks. Do not add npm packages.
- Data lives in `data/tickets.json` and is read and written through `store.js` only.
- If `node_modules` is missing (for example in a new worktree), run `npm install` first.
- Run `npm test` before and after every change. Never weaken or delete a test to make it pass.
- Keep changes small: touch only the files the task needs.
- When you finish, summarise in 3 bullets: what was wrong, what you changed, the test result.
