import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import api from "../api/api.js";

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  border: "1px solid var(--line)", background: "#fff", color: "var(--ink)",
  fontSize: 14, outline: "none", transition: "border-color 0.2s",
};

const emptyForm = { firstName: "", lastName: "", phone: "", dob: "", email: "", password: "" };

export default function K25Auth() {
  const [mode, setMode] = useState("register"); // register | login
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => navigate("/dashboard"), 1600);
    return () => clearTimeout(t);
  }, [popup, navigate]);

  const focusIn = e => e.target.style.borderColor = "var(--forest)";
  const focusOut = e => e.target.style.borderColor = "var(--line)";

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = mode === "register"
        ? await api.k25Register(form)
        : await api.k25Login({ email: form.email, password: form.password });
      localStorage.setItem("K25_user", JSON.stringify(result));
      setPopup(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 60px" }}>
      <div style={{ maxWidth: 460, width: "100%" }}>
        <Reveal>
          <div style={{ display: "flex", background: "var(--sage)", borderRadius: 9999, padding: 4, marginBottom: 32 }}>
            {["register", "login"].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 9999, border: "none", fontSize: 14, fontWeight: 600,
                  background: mode === m ? "var(--forest)" : "transparent",
                  color: mode === m ? "#fff" : "var(--ink)",
                  transition: "all 0.25s",
                }}
              >
                {m === "register" ? "New Member" : "Log In"}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-display" style={{ fontSize: 30, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>
            {mode === "register" ? "Join K25" : "Welcome back"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>
            {mode === "register" ? "Only 26 member slots — first come, first served." : "Log in to contribute or check your status."}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "register" && (
              <>
                <div style={{ display: "flex", gap: 12 }}>
                  <input style={inputStyle} placeholder="First Name" name="firstName" value={form.firstName} onChange={handleChange} onFocus={focusIn} onBlur={focusOut} required />
                  <input style={inputStyle} placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleChange} onFocus={focusIn} onBlur={focusOut} required />
                </div>
                <input style={inputStyle} placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange} onFocus={focusIn} onBlur={focusOut} required />
                <label style={{ fontSize: 12, color: "var(--muted)" }}>Date of Birth
                  <input style={{ ...inputStyle, marginTop: 6 }} type="date" name="dob" value={form.dob} onChange={handleChange} onFocus={focusIn} onBlur={focusOut} required />
                </label>
              </>
            )}
            <input style={inputStyle} type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} onFocus={focusIn} onBlur={focusOut} autoComplete="email" required />
<input style={inputStyle} type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} onFocus={focusIn} onBlur={focusOut} autoComplete={mode === "register" ? "new-password" : "current-password"} required />
            {error && <div style={{ fontSize: 13, color: "var(--rust)" }}>{error}</div>}

            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "14px 0", borderRadius: 9999, border: "none",
              background: "var(--ochre)", color: "#fff", fontWeight: 600, fontSize: 15,
              transition: "transform 0.2s", opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {loading ? "Please wait…" : mode === "register" ? "Create Account" : "Log In"}
            </button>
          </form>
        </Reveal>
      </div>

      {popup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(23,20,15,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", textAlign: "center", maxWidth: 360 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <h3 className="font-display" style={{ fontSize: 20, color: "var(--forest)", marginBottom: 8, fontWeight: 500 }}>
              Sucessfully Maatikitta Da Yebba...
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>You're in! Taking you to your dashboard.</p>
            <button onClick={() => navigate("/dashboard")} style={{
              padding: "10px 28px", borderRadius: 9999, border: "none",
              background: "var(--forest)", color: "#fff", fontWeight: 600, fontSize: 13,
            }}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}