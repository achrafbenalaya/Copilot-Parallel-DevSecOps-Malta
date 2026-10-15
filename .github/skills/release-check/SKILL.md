---
name: release-check
description: Run the TicketLab release checklist (tests + smoke check) and write a short report. Use when the user asks if the app is ready to ship, or asks for a release check.
---

# Release check

1. Run `npm run release-check` from the repo root.
2. Open the generated `release-report.md` and read it.
3. If anything failed, explain the failing check in one sentence. Do NOT fix code silently.
4. If everything passed, draft a 3-line pull request description:
   - What changed (look at `git diff --stat`)
   - Why (the bug that was fixed)
   - Evidence (the numbers from the report)
