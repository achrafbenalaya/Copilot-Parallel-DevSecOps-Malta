import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "../server.js";

let server, base;
before(async () => { server = await startServer(0); base = `http://localhost:${server.address().port}`; });
after(() => server.close());

const get = async (qs) => (await fetch(`${base}/api/tickets${qs}`)).json();

test("returns all 6 tickets", async () => {
  assert.equal((await get("")).length, 6);
});

test("filters by priority", async () => {
  assert.equal((await get("?priority=high")).length, 2);
});

test("search finds 'Printer'", async () => {
  assert.equal((await get("?q=Printer")).length, 1);
});

test("search is case-insensitive: 'Login' finds both login tickets", async () => {
  assert.equal((await get("?q=Login")).length, 2);
});

test("search 'LOGIN' returns the same tickets as 'login'", async () => {
  const lower = (await get("?q=login")).map((t) => t.id);
  const upper = (await get("?q=LOGIN")).map((t) => t.id);
  assert.deepEqual(upper, lower);
});
