import { Mail, MailIcon } from "lucide-react";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "./Socialicons.jsx";

/* Replace these placeholder links with your real profile/contact links */
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/kaleemians25", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/kaleemians25", icon: FacebookIcon },
  { label: "WhatsApp", href: "https://wa.me/910000000000?text=hi", icon: WhatsAppIcon },
  { label: "Email", href: "mailto:hello@kaleemians25.org", icon: Mail },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--forest-dark)", padding: "48px 24px 28px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 className="font-display" style={{
          fontSize: "clamp(22px,3.5vw,30px)", fontStyle: "italic", fontWeight: 500,
          color: "#fff", marginBottom: 20,
        }}>
          Kaleemians 25
        </h2>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)",
                transition: "transform 0.25s, background 0.25s, color 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "var(--ochre)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 20 }} />

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
          © {new Date().getFullYear()} Kaleemians 25. All rights reserved.
        </p>
      </div>
    </footer>
  );
}