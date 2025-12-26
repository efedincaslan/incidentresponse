// In Netlify, we’ll inject this at build time.
const API_BASE = "https://incidentresponse-luof.onrender.com";


const el = (id) => document.getElementById(id);
const listEl = el("list");
const statusEl = el("status");

async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.headers.get("content-type")?.includes("application/json") ? res.json() : res.text();
}

function render(tickets) {
  listEl.innerHTML = tickets.map(t => `
    <div class="ticket">
      <div class="row">
        <strong>#${t.id}</strong> ${escapeHtml(t.title)}
        <span class="pill">${t.priority}</span>
        <span class="pill">${t.status}</span>
      </div>
      <div class="desc">${escapeHtml(t.description)}</div>
      <div class="row actions">
        <button onclick="setStatus(${t.id}, 'open')">open</button>
        <button onclick="setStatus(${t.id}, 'in_progress')">in_progress</button>
        <button onclick="setStatus(${t.id}, 'closed')">closed</button>
        <button class="danger" onclick="del(${t.id})">delete</button>
      </div>
    </div>
  `).join("");
}

function escapeHtml(s) {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

async function refresh() {
  statusEl.textContent = `API: ${API_BASE}`;
  const tickets = await api("/tickets");
  render(tickets);
}

window.setStatus = async (id, status) => {
  await api(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  refresh();
};

window.del = async (id) => {
  await api(`/tickets/${id}`, { method: "DELETE" });
  refresh();
};

el("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    title: el("title").value.trim(),
    description: el("desc").value.trim(),
    priority: el("priority").value,
  };
  await api("/tickets", { method: "POST", body: JSON.stringify(payload) });
  e.target.reset();
  refresh();
});

refresh().catch(err => statusEl.textContent = `Error: ${err.message}`);
