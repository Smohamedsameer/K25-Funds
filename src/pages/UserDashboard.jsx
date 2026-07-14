import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Reveal from "../components/Reveal.jsx";

// TODO: replace with the real backend origin from api.js once it's shared —
// this must match whatever base URL your other api.* calls use.
const BACKEND_ORIGIN = import.meta.env.VITE_API_URL;

const STATUS_STYLE = {
  PENDING: { bg: "#F4E9D4", color: "#8A6A1E" },
  APPROVED: { bg: "#E1EFE3", color: "#1F4D3D" },
  REJECTED: { bg: "#F6E1DE", color: "#B54B3A" },
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function yearOf(monthKeyStr) {
  return monthKeyStr.split("-")[0];
}

function ContributionRow({ c }) {
  const s = STATUS_STYLE[c.status] || STATUS_STYLE.PENDING;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
      padding: "14px 18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)",
    }}>
      <div>
        <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)", marginRight: 10 }}>
          {formatDate(c.createdAt)}
        </span>
        <span className="font-mono" style={{ fontSize: 14, fontWeight: 600 }}>
          ₹{Number(c.amount).toLocaleString("en-IN")}
        </span>
      </div>
      {c.screenshotPath && (
        <a
          href={`${BACKEND_ORIGIN}/uploads/${c.screenshotPath}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "var(--forest)" }}
        >
          View screenshot
        </a>
      )}
      <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 9999, background: s.bg, color: s.color }}>
        {c.status}
      </span>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'err', text }
  const [openMonths, setOpenMonths] = useState({}); // { [monthKey]: bool }
  const [openYears, setOpenYears] = useState({}); // { [year]: bool }

  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const currentYear = String(today.getFullYear());

  const loadHistory = (userId) => {
    fetch(`${BACKEND_ORIGIN}/api/contributions/user/${userId}`)
      .then(res => res.json())
      .then(setContributions)
      .catch(() => {});
  };

  useEffect(() => {
    const stored = localStorage.getItem("k25_user");
    if (!stored) { navigate("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    loadHistory(parsed.id);
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("k25_user"); navigate("/"); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !screenshot || !user) return;
    setBusy(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append("userId", user.id);
      form.append("amount", amount);
      form.append("screenshot", screenshot);

      const res = await fetch(`${BACKEND_ORIGIN}/api/contributions`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Could not submit contribution.");
      }
      setMsg({ type: "ok", text: "Contribution submitted — pending admin review." });
      setAmount(""); setScreenshot(null);
      loadHistory(user.id);
    } catch (err) {
      setMsg({ type: "err", text: err.message || "Could not submit contribution." });
    } finally {
      setBusy(false);
    }
  };

  // Group contributions by month, most recent first
  const grouped = useMemo(() => {
    const map = {};
    for (const c of contributions) {
      const key = monthKey(c.createdAt);
      if (!map[key]) map[key] = [];
      map[key].push(c);
    }
    return Object.entries(map).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [contributions]);

  const toggleMonth = (key) => setOpenMonths(prev => ({ ...prev, [key]: !prev[key] }));

  // Group the month buckets above into year buckets. This is what makes the
  // history "empty" after a year rolls over — last year's months collapse
  // behind a single "2025" button instead of listing indefinitely.
  const groupedByYear = useMemo(() => {
    const map = {};
    for (const [key, items] of grouped) {
      const year = yearOf(key);
      if (!map[year]) map[year] = [];
      map[year].push([key, items]);
    }
    return Object.entries(map).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [grouped]);

  const toggleYear = (year) => setOpenYears(prev => ({ ...prev, [year]: !prev[year] }));

  const renderMonthGroup = (key, items) => {
    const isCurrent = key === currentMonthKey;
    const isOpen = isCurrent || !!openMonths[key];
    const total = items.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    return (
      <div key={key} style={{ marginBottom: 16 }}>
        {isCurrent ? (
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--forest)", marginBottom: 10 }}>
            {monthLabel(key)} (this month)
          </div>
        ) : (
          <button
            onClick={() => toggleMonth(key)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
              border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 14,
              padding: "12px 18px", cursor: "pointer", marginBottom: isOpen ? 10 : 0,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
              {monthLabel(key)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                {items.length} · ₹{total.toLocaleString("en-IN")}
              </span>
              <ChevronDown size={16} style={{ transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </span>
          </button>
        )}

        {isOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map(c => <ContributionRow key={c.id} c={c} />)}
          </div>
        )}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 32px", background: "rgba(251,246,236,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}>
        <span className="font-mono" style={{ fontSize: 12, letterSpacing: "0.15em", color: "var(--muted)" }}>
          K25 · {user.firstName}
        </span>
        <button onClick={handleLogout} style={{
          padding: "9px 20px", borderRadius: 9999, border: "1px solid var(--line)",
          background: "transparent", color: "var(--ink)", fontSize: 13, fontWeight: 600,
        }}>Logout</button>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 100px" }}>
        <Reveal>
          <h1 className="font-display" style={{ fontSize: 28, color: "var(--forest)", fontWeight: 500, marginBottom: 8 }}>
            Welcome, {user.firstName}
          </h1>
          <p className="font-mono" style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
            Today · {formatDate(today.toISOString())}
          </p>
        </Reveal>

        {/* Submit contribution */}
        <Reveal>
          <form onSubmit={handleSubmit} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: 24, marginBottom: 48 }}>
            <h3 className="font-display" style={{ fontSize: 18, color: "var(--forest)", fontWeight: 500, marginBottom: 12 }}>Submit a Contribution</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)" }} />
              <input type="file" accept="image/*" onChange={e => setScreenshot(e.target.files[0])} style={{ fontSize: 12 }} />
              <button type="submit" disabled={busy} style={{ padding: "10px 0", borderRadius: 10, border: "none", background: "var(--forest)", color: "#fff", fontWeight: 600, opacity: busy ? 0.6 : 1 }}>
                {busy ? "Submitting…" : "Submit Contribution"}
              </button>
            </div>
            {msg && (
              <div style={{ marginTop: 10, fontSize: 13, color: msg.type === "ok" ? "var(--forest)" : "var(--rust)" }}>
                {msg.text}
              </div>
            )}
          </form>
        </Reveal>

        {/* Contribution history */}
        <Reveal>
          <h3 style={{ fontSize: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            Your Contribution History
          </h3>
        </Reveal>

        {groupedByYear.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>No contributions submitted yet.</p>
        )}

        {groupedByYear.map(([year, monthGroups]) => {
          const isCurrentYear = year === currentYear;
          const isYearOpen = isCurrentYear || !!openYears[year];
          const yearCount = monthGroups.reduce((sum, [, items]) => sum + items.length, 0);
          const yearTotal = monthGroups.reduce((sum, [, items]) => sum + items.reduce((s, c) => s + Number(c.amount || 0), 0), 0);

          return (
            <div key={year} style={{ marginBottom: 20 }}>
              {isCurrentYear ? (
                <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  {year}
                </div>
              ) : (
                <button
                  onClick={() => toggleYear(year)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                    border: "1px solid var(--line)", background: "var(--ochre)", color: "#fff", borderRadius: 14,
                    padding: "14px 18px", cursor: "pointer", marginBottom: isYearOpen ? 14 : 0, fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{year}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="font-mono" style={{ fontSize: 12, opacity: 0.9 }}>
                      {yearCount} · ₹{yearTotal.toLocaleString("en-IN")}
                    </span>
                    <ChevronDown size={16} style={{ transition: "transform 0.25s", transform: isYearOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </span>
                </button>
              )}

              {isYearOpen && monthGroups.map(([key, items]) => renderMonthGroup(key, items))}
            </div>
          );
        })}
      </div>
    </div>
  );
}