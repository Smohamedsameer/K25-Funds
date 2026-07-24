import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BANNER_HEIGHT } from "./TopBanner.jsx";
import { useMenu } from "./Menucontext.jsx";

const LINKS = [
  { label: "Home", to: "/", match: ["/"] },
  // These point at the on-page sections on Home ("/#about" etc). The
  // standalone /about, /purpose, /gallery pages still exist separately —
  // `match` just makes the nav highlight correctly if someone is on one
  // of those standalone pages directly.
  { label: "About", to: "/#about", sectionId: "about", match: ["/about"] },
  { label: "Purpose", to: "/#purpose", sectionId: "purpose", match: ["/purpose"] },
  { label: "Gallery", to: "/#gallery", sectionId: "gallery", match: ["/gallery"] },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { menuOpen, setMenuOpen } = useMenu();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => { setMenuOpen(false); }, [location.pathname, setMenuOpen]);

  // If we're already on "/", clicking About/Purpose/Gallery should just
  // smooth-scroll to that section instead of doing a full navigation.
  const handleNavClick = (e, link) => {
    setMenuOpen(false);
    if (link.sectionId && location.pathname === "/") {
      e.preventDefault();
      document.getElementById(link.sectionId)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", link.to);
    }
  };

  // Same idea for the "Login" CTA button — its actual destination stays
  // "/login" (so typing/visiting it directly still works as a full page),
  // but if we're already on Home, just scroll down to the #login section.
  const handleLoginClick = (e) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", "/#login");
    }
  };

  return (
    <header style={{
      position: "fixed", top: BANNER_HEIGHT, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "center", padding: "20px 24px",
    }}>
      <nav
        className="k25-navbar"
        style={{
          display: "flex", alignItems: "center", gap: 4,
          background: scrolled ? "rgba(251,246,236,0.9)" : "rgba(251,246,236,0.55)",
          backdropFilter: "blur(14px)",
          border: "1px solid var(--line)",
          borderRadius: menuOpen ? 24 : 9999,
          padding: "8px 8px 8px 22px",
          boxShadow: scrolled ? "0 6px 24px rgba(35,32,27,0.08)" : "none",
          transition: "box-shadow 0.3s, background 0.3s, border-radius 0.25s",
          flexWrap: "wrap",
          width: menuOpen ? "min(340px, calc(100vw - 48px))" : "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--muted)", marginRight: 18 }}>
            K25 · FUND
          </span>

          {/* Desktop links */}
          <div className="k25-nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {LINKS.map(link => {
              const active = link.match.includes(location.pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={e => handleNavClick(e, link)}
                  style={{
                    position: "relative", fontSize: 14, fontWeight: 500,
                    padding: "8px 16px", borderRadius: 9999, textDecoration: "none",
                    color: active ? "#fff" : "var(--ink)",
                    background: active ? "var(--forest)" : "transparent",
                    transition: "background 0.25s, color 0.25s, transform 0.2s",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--sage)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; } }}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              to="/login"
              onClick={handleLoginClick}
              style={{
                marginLeft: 8, fontSize: 14, fontWeight: 600,
                padding: "9px 22px", borderRadius: 9999, textDecoration: "none",
                background: "var(--ochre)", color: "#fff",
                transition: "transform 0.2s, background 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--ochre-dark)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--ochre)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile dropdown column — opened via the hamburger button in TopBanner */}
        {menuOpen && (
          <div
            className="k25-nav-mobile"
            style={{
              display: "flex", flexDirection: "column", width: "100%",
              gap: 4, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)",
            }}
          >
            {LINKS.map(link => {
              const active = link.match.includes(location.pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={e => handleNavClick(e, link)}
                  style={{
                    fontSize: 15, fontWeight: 500, padding: "12px 16px",
                    borderRadius: 14, textDecoration: "none",
                    color: active ? "#fff" : "var(--ink)",
                    background: active ? "var(--forest)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/login"
              onClick={handleLoginClick}
              style={{
                marginTop: 6, textAlign: "center", fontSize: 15, fontWeight: 600,
                padding: "12px 0", borderRadius: 14, textDecoration: "none",
                background: "var(--ochre)", color: "#fff",
              }}
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Responsive breakpoint rules */}
      <style>{`
        @media (max-width: 768px) {
          .k25-nav-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}