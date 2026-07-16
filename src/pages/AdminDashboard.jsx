import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import api from "../api/api.js";

function CountUp({ value, prefix = "₹" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1000;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span className="font-mono">{prefix}{display.toLocaleString("en-IN")}</span>;
}

const STATUS_STYLE = {
  PENDING: { bg: "#F4E9D4", color: "#8A6A1E" },
  APPROVED: { bg: "#E1EFE3", color: "#1F4D3D" },
  REJECTED: { bg: "#F6E1DE", color: "#B54B3A" },
};

// Used only for the CSV/report export links below — those are real backend
// routes, not uploaded files, so they don't go through api.fileUrl().
const BACKEND_ORIGIN = import.meta.env.VITE_API_URL;

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const monthLabel = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ balanceCash: 0, thisMonthIncome: 0 });
  const [users, setUsers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [targetInput, setTargetInput] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseFile, setExpenseFile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [targetMsg, setTargetMsg] = useState(null);
  const [expenseMsg, setExpenseMsg] = useState(null);
  const [targetBusy, setTargetBusy] = useState(false);
  const [expenseBusy, setExpenseBusy] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const loadAll = () => {
    api.getAdminSummary().then(setSummary).catch(() => {});
    api.getAllUsers().then(setUsers).catch(() => {});
    api.getContributions().then(setContributions).catch(() => {});
    api.getExpenses().then(setExpenses).catch(() => {});
  };

  useEffect(() => {
    if (localStorage.getItem("k25_admin") !== "true") { navigate("/admin-login"); return; }
    loadAll();
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("k25_admin"); navigate("/"); };

  const handleStatus = async (id, status) => {
    await api.updateContributionStatus(id, status);
    loadAll();
  };

  const handleDeleteContribution = async (id) => {
    if (!window.confirm("Delete this contribution record?")) return;
    await api.deleteContribution(id);
    loadAll();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Remove this member and all their data?")) return;
    await api.deleteUserAsAdmin(id);
    loadAll();
  };

  const handleTargetUpdate = async (e) => {
    e.preventDefault();
    if (!targetInput) return;
    setTargetBusy(true);
    setTargetMsg(null);
    try {
      await api.updateTarget(Number(targetInput));
      setTargetMsg({ type: "ok", text: "Target updated — now live on the Home page." });
      setTargetInput("");
      loadAll();
    } catch (err) {
      setTargetMsg({ type: "err", text: err.message || "Could not update target." });
    } finally {
      setTargetBusy(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseAmount) return;
    setExpenseBusy(true);
    setExpenseMsg(null);
    try {
      await api.addExpense(expenseAmount, expenseDesc, expenseFile);
      setExpenseMsg({ type: "ok", text: "Expense logged — Raised So Far updated." });
      setExpenseAmount(""); setExpenseDesc(""); setExpenseFile(null);
      loadAll();
    } catch (err) {
      setExpenseMsg({ type: "err", text: err.message || "Could not log expense." });
    } finally {
      setExpenseBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 32px", background: "rgba(251,246,236,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}>
        <span className="font-mono" style={{ fontSize: 12, letterSpacing: "0.15em", color: "var(--muted)" }}>K25 · ADMIN</span>
        <button onClick={handleLogout} style={{
          padding: "9px 20px", borderRadius: 9999, border: "1px solid var(--line)",
          background: "transparent", color: "var(--ink)", fontSize: 13, fontWeight: 600,
        }}>Logout</button>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 24px 100px" }}>
        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 48 }}>
          <Reveal>
            <div style={{ background: "var(--forest)", color: "#fff", borderRadius: 20, padding: "28px 26px" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8, marginBottom: 10 }}>Balance Cash</div>
              <div style={{ fontSize: 32, fontWeight: 600 }}><CountUp value={summary.balanceCash || 0} /></div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "28px 26px" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>This Month Income</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: "var(--forest)" }}><CountUp value={summary.thisMonthIncome || 0} /></div>
            </div>
          </Reveal>
        </div>

        {/* Target + Expense management */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 48 }}>
          <Reveal>
            <form onSubmit={handleTargetUpdate} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: 24 }}>
              <h3 className="font-display" style={{ fontSize: 18, color: "var(--forest)", fontWeight: 500, marginBottom: 12 }}>Next Month Target</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <input type="number" placeholder="e.g. 2500" value={targetInput} onChange={e => setTargetInput(e.target.value)}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)" }} />
                <button type="submit" disabled={targetBusy} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "var(--ochre)", color: "#fff", fontWeight: 600, opacity: targetBusy ? 0.6 : 1 }}>
                  {targetBusy ? "Updating…" : "Update"}
                </button>
              </div>
              {targetMsg && (
                <div style={{ marginTop: 10, fontSize: 13, color: targetMsg.type === "ok" ? "var(--forest)" : "var(--rust)" }}>
                  {targetMsg.text}
                </div>
              )}
            </form>
          </Reveal>
          <Reveal delay={100}>
            <form onSubmit={handleExpenseSubmit} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: 24 }}>
              <h3 className="font-display" style={{ fontSize: 18, color: "var(--forest)", fontWeight: 500, marginBottom: 12 }}>Log Expense</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="number" placeholder="Amount (₹)" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)" }} />
                <input type="text" placeholder="Description" value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)" }} />
                <h6>Upload Payment Screenshot</h6>
                <input type="file" accept="image/*" onChange={e => setExpenseFile(e.target.files[0])} style={{ fontSize: 12 }} />
                <button type="submit" disabled={expenseBusy} style={{ padding: "10px 0", borderRadius: 10, border: "none", background: "var(--forest)", color: "#fff", fontWeight: 600, opacity: expenseBusy ? 0.6 : 1 }}>
                  {expenseBusy ? "Adding…" : "Add Expense"}
                </button>
              </div>
              {expenseMsg && (
                <div style={{ marginTop: 10, fontSize: 13, color: expenseMsg.type === "ok" ? "var(--forest)" : "var(--rust)" }}>
                  {expenseMsg.text}
                </div>
              )}
            </form>
          </Reveal>
        </div>

        {/* Contribution review */}
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ fontSize: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Contribution Review</h3>
            <a
              href={`${BACKEND_ORIGIN}/api/admin/export/contributions`}
              style={{
                fontSize: 12, fontWeight: 600, color: "var(--forest)", textDecoration: "none",
                border: "1px solid var(--line)", borderRadius: 9999, padding: "6px 14px",
              }}
            >
              Download {monthLabel} Contribution Report
            </a>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
          {contributions.length === 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>No contributions submitted yet.</p>}
          {contributions.map(c => {
            const s = STATUS_STYLE[c.status] || STATUS_STYLE.PENDING;
            const shotPath = api.screenshotPathOf(c);
            const shotUrl = api.fileUrl(shotPath);
            return (
              <div key={c.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
                padding: "14px 18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.userName || `User #${c.userId}`}</div>
                  <div>
                    <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)", marginRight: 10 }}>
                      {formatDate(c.createdAt)}
                    </span>
                    <span className="font-mono" style={{ fontSize: 13, color: "var(--muted)" }}>
                      ₹{Number(c.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                {shotUrl && (
                  <button
                    onClick={() => setPreviewImg(shotUrl)}
                    style={{
                      fontSize: 12, color: "var(--forest)", background: "transparent",
                      border: "none", textDecoration: "underline", cursor: "pointer", padding: 0,
                    }}
                  >
                    View screenshot
                  </button>
                )}
                <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 9999, background: s.bg, color: s.color }}>{c.status}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleStatus(c.id, "APPROVED")} title="Approve" style={{ border: "none", background: "#E1EFE3", color: "#1F4D3D", borderRadius: 8, padding: "6px 10px", fontWeight: 700 }}>✓</button>
                  <button onClick={() => handleStatus(c.id, "REJECTED")} title="Reject" style={{ border: "none", background: "#F6E1DE", color: "#B54B3A", borderRadius: 8, padding: "6px 10px", fontWeight: 700 }}>✕</button>
                  <button onClick={() => handleDeleteContribution(c.id)} title="Delete" style={{ border: "1px solid var(--line)", background: "transparent", borderRadius: 8, padding: "6px 10px" }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Member board */}
        <Reveal>
          <h3 style={{ fontSize: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            Member Board ({users.length}/26)
          </h3>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {(showAllMembers ? users : users.slice(0, 3)).map(u => (
            <div key={u.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
              padding: "14px 18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{u.email} · {u.phone}</div>
              </div>
              <button onClick={() => handleDeleteUser(u.id)} style={{ border: "1px solid var(--rust)", color: "var(--rust)", background: "transparent", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {users.length > 3 && (
          <button
            onClick={() => setShowAllMembers(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6, margin: "0 auto 48px",
              border: "none", background: "transparent", color: "var(--forest)",
              fontSize: 13, fontWeight: 600, padding: "6px 4px",
            }}
          >
            {showAllMembers ? "Show less" : `Show all ${users.length} members`}
            <ChevronDown size={16} style={{ transition: "transform 0.25s", transform: showAllMembers ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
        )}

        {/* Expense log */}
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ fontSize: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Expense Log</h3>
            <a
              href={`${BACKEND_ORIGIN}/api/admin/export/expenses`}
              style={{
                fontSize: 12, fontWeight: 600, color: "var(--forest)", textDecoration: "none",
                border: "1px solid var(--line)", borderRadius: 9999, padding: "6px 14px",
              }}
            >
              Download {monthLabel} Expense Report
            </a>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {expenses.length === 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>No expenses logged yet.</p>}
          {(showAllExpenses ? expenses : expenses.slice(0, 3)).map(ex => {
            const shotUrl = api.fileUrl(api.screenshotPathOf(ex));
            return (
              <div key={ex.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
                padding: "14px 18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)",
              }}>
                <div>
                  <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)", marginRight: 10 }}>
                    {formatDate(ex.createdAt)}
                  </span>
                  <span className="font-mono" style={{ fontSize: 14, fontWeight: 600 }}>₹{Number(ex.amount).toLocaleString("en-IN")}</span>
                  <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 10 }}>{ex.description}</span>
                </div>
                {shotUrl && (
                  <button
                    onClick={() => setPreviewImg(shotUrl)}
                    style={{ fontSize: 12, color: "var(--forest)", background: "transparent", border: "none", textDecoration: "underline", cursor: "pointer", padding: 0 }}
                  >
                    Screenshot
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {expenses.length > 3 && (
          <button
            onClick={() => setShowAllExpenses(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6, margin: "16px auto 0",
              border: "none", background: "transparent", color: "var(--forest)",
              fontSize: 13, fontWeight: 600, padding: "6px 4px",
            }}
          >
            {showAllExpenses ? "Show less" : `Show all ${expenses.length} expenses`}
            <ChevronDown size={16} style={{ transition: "transform 0.25s", transform: showAllExpenses ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
        )}
      </div>

      {/* Screenshot preview modal */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(35,32,27,0.75)", zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out",
          }}
        >
          <img src={previewImg} alt="Payment screenshot" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12 }} />
        </div>
      )}
    </div>
  );
}