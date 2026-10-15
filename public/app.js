const list = document.getElementById("list");
const count = document.getElementById("count");
const search = document.getElementById("search");
const priority = document.getElementById("priority");

let totalTickets = 0;

async function refresh() {
  const params = new URLSearchParams({ priority: priority.value, q: search.value });
  const tickets = await (await fetch("/api/tickets?" + params)).json();
  if (!search.value && priority.value === "all") totalTickets = tickets.length;

  list.innerHTML = tickets
    .map((t) => `<li class="card ${t.priority}"><b>#${t.id}</b> ${t.title}
      <span class="tag">${t.priority}</span><span class="tag">${t.status}</span></li>`)
    .join("");

  // BUG (demo 2): shows the TOTAL, not what is on screen.
  count.textContent = `${totalTickets} tickets`;
}

search.addEventListener("input", refresh);
priority.addEventListener("change", refresh);
refresh();
