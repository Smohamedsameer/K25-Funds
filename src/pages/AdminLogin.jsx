import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import api from "../api/api.js";

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  border: "1px solid var(--line)", background: "#fff", color: "var(--ink)",
  fontSize: 14, outline: "none", transition: "border-color 0.2s",
};

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const focusIn = e => e.target.style.borderColor = "var(--forest)";
  const focusOut = e => e.target.style.borderColor = "var(--line)";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.adminLogin(form);
      localStorage.setItem("k25_admin", "true");
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 60px" }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <Reveal>
          <h1 className="font-display" style={{ fontSize: 30, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>Admin Login</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>Restricted access — fund management only.</p>
        </Reveal>
        <Reveal delay={100}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input style={inputStyle} placeholder="Username" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              onFocus={focusIn} onBlur={focusOut} required />
            <input style={inputStyle} type="password" placeholder="Password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onFocus={focusIn} onBlur={focusOut} required />
            {error && <div style={{ fontSize: 13, color: "var(--rust)" }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "14px 0", borderRadius: 9999, border: "none",
              background: "var(--forest)", color: "#fff", fontWeight: 600, fontSize: 15,
              transition: "transform 0.2s", opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {loading ? "Checking…" : "Log In"}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
