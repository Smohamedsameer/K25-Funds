import { useMenu } from "./MenuContext.jsx";

export const BANNER_HEIGHT = 64; // px — keep Navbar.jsx's `top` in sync with this

export default function TopBanner() {
  const { menuOpen, setMenuOpen } = useMenu();

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
      height: BANNER_HEIGHT,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0F231B 0%, #1F4D3D 60%, #163828 100%)",
      borderBottom: "1px solid rgba(201,138,44,0.35)",
      overflow: "hidden",
    }}>
      {/* faint decorative dot grid, echoes the reference logo's tech backdrop */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }} />

      {/* Mobile hamburger — top left of the banner */}
      <button
        className="k25-banner-toggle"
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          display: "none", border: "none", background: "rgba(255,255,255,0.12)",
          width: 36, height: 36, borderRadius: 9999, alignItems: "center",
          justifyContent: "center", color: "#fff", fontSize: 18,
          cursor: "pointer", zIndex: 1,
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <h1
        className="font-display"
        style={{
          position: "relative",
          fontSize: "clamp(20px, 3vw, 28px)",
          fontStyle: "italic",
          fontWeight: 500,
          letterSpacing: "0.02em",
          background: "linear-gradient(90deg, #FFFFFF 0%, #E7EEE7 35%, #C98A2C 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 24px rgba(201,138,44,0.25)",
        }}
      >
        Kaleemians 25
      </h1>

      <style>{`
        @media (max-width: 768px) {
          .k25-banner-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}