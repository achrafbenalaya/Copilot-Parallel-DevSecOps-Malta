// A tiny MCP server: it gives Copilot 3 tools to work with our tickets.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { findTickets, loadTickets, addTicket } from "../store.js";

const server = new McpServer({ name: "ticketlab", version: "1.0.0" });
const asText = (data) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });

server.tool(
  "list_tickets",
  "List tickets. Optional filters: priority (high|normal|low) and status (open|closed).",
  { priority: z.enum(["high", "normal", "low"]).optional(), status: z.enum(["open", "closed"]).optional() },
  async ({ priority, status }) => {
    let tickets = findTickets({ priority });
    if (status) tickets = tickets.filter((t) => t.status === status);
    return asText(tickets);
  }
);

server.tool(
  "get_ticket",
  "Get one ticket by its id.",
  { id: z.number() },
  async ({ id }) => asText(loadTickets().find((t) => t.id === id) ?? "Ticket not found")
);

server.tool(
  "create_ticket",
  "Create a new open ticket.",
  { title: z.string().min(3), priority: z.enum(["high", "normal", "low"]).default("normal") },
  async ({ title, priority }) => asText(addTicket({ title, priority }))
);

await server.connect(new StdioServerTransport());
