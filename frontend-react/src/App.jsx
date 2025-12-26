import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

async function api(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  // DELETE endpoints return JSON? If not, guard:
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

function Badge({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.08)",
        fontSize: 12,
      }}
    >
      {children}
    </span>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        overflow: "hidden", // ✅ prevents the white overflow blob
      }}
    >
      {children}
    </div>
  );
}


function Button({ children, variant = "primary", ...props }) {
  const bg =
    variant === "danger"
      ? "rgba(239,68,68,0.22)"
      : variant === "secondary"
      ? "rgba(255,255,255,0.06)"
      : "rgba(59,130,246,0.30)";

  return (
    <button
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        background: bg,
        color: "#e6edf7",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const [q, setQ] = useState("");

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const data = await api("/tickets");
      setTickets(data || []);
    } catch (e) {
      setErr(e.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tickets.filter((t) => {
      if (!needle) return true;
      return (
        String(t.title || "").toLowerCase().includes(needle) ||
        String(t.description || "").toLowerCase().includes(needle)
      );
    });
  }, [tickets, q]);

  async function createTicket(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) return setErr("Title is required.");

    try {
      await api("/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
        }),
      });
      setTitle("");
      setDescription("");
      setPriority("low");
      await refresh();
    } catch (e2) {
      setErr(e2.message || "Create failed");
    }
  }

  async function removeTicket(id) {
    setErr("");
    if (!confirm("Delete this ticket?")) return;
    try {
      await api(`/tickets/${id}`, { method: "DELETE" });
      await refresh();
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1000px 600px at 20% 0%, rgba(59,130,246,0.20), transparent), #0b1220",
        color: "#e6edf7",
      }}
    >
      <div style={{ width: "100%", padding: "26px 24px 60px" }}>
  <div
    style={{
      display: "grid",
      gridTemplateRows: "auto 1fr",
      height: "calc(100vh - 26px)",
      gap: 14,
    }}
  >

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>TicketDesk</div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>React + FastAPI + Neon Postgres</div>
          </div>
          <Badge>API: {API_BASE}</Badge>
        </div>

        {err && (
          <div style={{ marginBottom: 12 }}>
            <Card>
              <div style={{ padding: 12, color: "rgba(255,160,160,0.95)" }}>{err}</div>
            </Card>
          </div>
        )}

        <div
  style={{
    display: "grid",
    gridTemplateColumns: "420px minmax(0, 1fr)",
    gap: 16,
    alignItems: "start",
    width: "100%",
  }}
>


          <Card>
            <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 700 }}>
              Create Ticket
            </div>
            <form onSubmit={createTicket} style={{ padding: 14, display: "grid", gap: 10 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.85 }}>Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Login button broken"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.25)",
                    color: "#e6edf7",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.85 }}>Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="What’s happening? Steps to reproduce?"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.25)",
                    color: "#e6edf7",
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.85 }}>Priority</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.25)",
                    color: "#e6edf7",
                  }}
                >
                  <option value="low">low</option>
                  <option value="med">med</option>
                  <option value="high">high</option>
                </select>
              </label>

              <Button type="submit">Create</Button>
            </form>
          </Card>

          <Card>
            <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>Tickets</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                style={{
                  width: 240,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.25)",
                  color: "#e6edf7",
                }}
              />
            </div>

            <div style={{ padding: 14, overflow: "auto", maxHeight: "calc(100vh - 220px)" }}>

              {loading ? (
                <div style={{ opacity: 0.8 }}>Loading…</div>
              ) : filtered.length === 0 ? (
                <div style={{ opacity: 0.75 }}>No tickets found.</div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {filtered.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(0,0,0,0.22)",
                        padding: 12,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            #{t.id} — {t.title}
                          </div>
                          <div style={{ opacity: 0.8, marginTop: 6, lineHeight: 1.35 }}>{t.description}</div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                          <Badge>priority: {t.priority}</Badge>
                          <Button variant="danger" onClick={() => removeTicket(t.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Button variant="secondary" onClick={refresh}>Refresh</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
