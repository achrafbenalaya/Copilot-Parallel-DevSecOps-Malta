import { readFileSync, writeFileSync } from "node:fs";
const FILE = new URL("./data/tickets.json", import.meta.url);

export function loadTickets() {
  return JSON.parse(readFileSync(FILE, "utf8"));
}

export function saveTickets(tickets) {
  writeFileSync(FILE, JSON.stringify(tickets, null, 2) + "\n");
}

// Filter tickets by priority and/or a search text.
export function findTickets({ priority, q } = {}) {
  let tickets = loadTickets();
  if (priority && priority !== "all") {
    tickets = tickets.filter((t) => t.priority === priority);
  }
  if (q) {
    // BUG (demo 1): search is case-sensitive. "Login" finds nothing.
    tickets = tickets.filter((t) => t.title.includes(q));
  }
  return tickets;
}

export function addTicket({ title, priority = "normal" }) {
  const tickets = loadTickets();
  const id = Math.max(0, ...tickets.map((t) => t.id)) + 1;
  const ticket = { id, title, priority, status: "open" };
  tickets.push(ticket);
  saveTickets(tickets);
  return ticket;
}
