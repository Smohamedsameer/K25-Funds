import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

export default function Login() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "140px 24px 60px",
    }}>
      <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
        <Reveal>
          <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--ochre-dark)", marginBottom: 16, textTransform: "uppercase" }}>Sign In</div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="font-display" style={{ fontSize: "clamp(30px,5vw,46px)", color: "var(--ink)", fontWeight: 500, marginBottom: 48 }}>
            Who's logging in?
          </h1>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          <Reveal delay={200}>
            <Link to="/k25" style={{
              display: "block", textDecoration: "none", padding: "44px 28px",
              borderRadius: 24, background: "var(--forest)", color: "#fff",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(31,77,61,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="font-display" style={{ fontSize: 26, fontWeight: 500, marginBottom: 8 }}>K25 Member</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Register or log in to contribute</div>
            </Link>
          </Reveal>
          <Reveal delay={300}>
            <Link to="/admin-login" style={{
              display: "block", textDecoration: "none", padding: "44px 28px",
              borderRadius: 24, background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)",
              transition: "transform 0.3s, border-color 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "var(--ochre)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--line)"; }}
            >
              <div className="font-display" style={{ fontSize: 26, fontWeight: 500, marginBottom: 8 }}>Admin</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Manage funds, targets & members</div>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
