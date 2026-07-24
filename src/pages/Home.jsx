import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import api from "../api/api.js";

function CountUp({ value, prefix = "", duration = 1400 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.floor(eased * value));
          if (p < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return <span ref={ref} className="font-mono">{prefix}{display.toLocaleString("en-IN")}</span>;
}

const STAT_CARDS = [
  { key: "target", label: "This Month's Target", prefix: "₹" },
  { key: "thisMonthIncome", label: "Raised So Far", prefix: "₹" },
  { key: "thisMonthCollected", label: "This Month Income", prefix: "₹" },
  { key: "contributors", label: "Contributors", prefix: "" },
];

const ABOUT_VALUES = [
  { title: "Transparent", text: "Every contribution and expense is logged and visible to the group — no black boxes." },
  { title: "Capped & Personal", text: "Membership is limited by design, so this stays a circle of people who know each other, not an anonymous fund." },
  { title: "Zero Overhead", text: "There's no office, no salary, no cut taken. Every rupee raised goes toward the cause it was raised for." },
];

const PILLARS = [
  { num: "01", title: "Education Support", text: "School fees, books, uniforms, and tuition for students whose families are stretched thin this term." },
  { num: "02", title: "Emergency Good Deeds", text: "Quiet, quick help — a medical bill, a repair, a meal — for someone in the community who needs it now, not after a form is processed." },
  { num: "03", title: "Community Requests", text: "Any member can flag a genuine need; the group reviews and decides together where the month's fund goes." },
];

const GALLERY_PREVIEW = [
  "./group1.jpg",
  "./group3.jpeg",
  "./group2.jpeg",
  "./group8.jpeg",
  "./group4.jpeg",
  "./group6.jpeg",
];

export default function Home() {
  const [summary, setSummary] = useState({ target: 2500, thisMonthIncome: 0, thisMonthCollected: 0, contributors: 0 });
  const location = useLocation();

  useEffect(() => {
    api.getSummary().then(setSummary).catch(() => {});
  }, []);

  // If we arrived at "/#about" (or #purpose / #gallery) from another page or
  // a nav-bar click, scroll smoothly to that section once it's rendered.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section style={{
        position: "relative", minHeight: "92vh", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img
            src="./gate.png"
            alt="Children learning together"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              animation: "heroZoom 22s ease-in-out infinite alternate",
            }}
          />
          <style>{`@keyframes heroZoom { from { transform: scale(1); } to { transform: scale(1.12); } }`}</style>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,77,61,0.55) 0%, rgba(23,20,15,0.75) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 780, padding: "160px 24px 80px" }}>
          <Reveal>
            <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "rgba(255,255,255,0.75)", marginBottom: 20, textTransform: "uppercase" }}>
              K25 · Community Fund
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display" style={{ fontSize: "clamp(38px,7vw,68px)", color: "#fff", lineHeight: 1.1, marginBottom: 24, fontWeight: 500 }}>
              Every rupee here becomes<br /><em>someone's next chapter.</em>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.8 }}>
              K25 is a small, transparent circle of contributors pooling money each month for
              education support and good deeds that need doing quietly, without red tape. No
              overhead, no middlemen — just neighbours funding what matters.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Link to="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "var(--ochre)", color: "#fff", fontWeight: 600, fontSize: 15,
              padding: "16px 36px", borderRadius: 9999, textDecoration: "none",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(201,138,44,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Contribute Now →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Stat cards — ledger style */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", transform: "translateY(-64px)" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20,
        }}>
          {STAT_CARDS.map((card, i) => (
            <Reveal key={card.key} delay={i * 100}>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--line)",
                borderRadius: 20, padding: "28px 26px", boxShadow: "0 16px 40px rgba(35,32,27,0.08)",
                transition: "transform 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                  {card.label}
                </div>
                <div style={{ fontSize: 34, fontWeight: 600, color: "var(--forest)" }}>
                  <CountUp value={summary[card.key] || 0} prefix={card.prefix} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 120px", textAlign: "center" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(26px,4vw,38px)", color: "var(--ink)", marginBottom: 18, fontWeight: 500 }}>
            Small, honest, and <em>accountable.</em>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
            Every contribution is logged, every expense is receipted, and every rupee's journey
            is visible to the people who gave it. That's the whole idea behind K25 — help that
            doesn't need a foundation, a form, or a fee to happen.
          </p>
        </Reveal>
      </section>

      {/* ===== About (on-page section, id="about") ===== */}
      <section id="about" style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 100px", scrollMarginTop: 150 }}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 48px" }}>
          <Reveal>
            <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--ochre-dark)", marginBottom: 16, textTransform: "uppercase" }}>About Us</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,5vw,44px)", color: "var(--ink)", fontWeight: 500, marginBottom: 20 }}>
              A circle of 26, giving on purpose.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
              K25 started as an idea between friends: what if a small, trusted group set aside a
              fixed amount every month and put it directly toward education support and good deeds
              in our own community — no paperwork, no waiting on approvals, no cut lost to overhead?
              The name comes from the cap on membership — exactly 26 contributors, no more.
            </p>
          </Reveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {ABOUT_VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--line)",
                borderRadius: 20, padding: "28px 26px", height: "100%",
                transition: "transform 0.3s, border-color 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--ochre)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--line)"; }}
              >
                <div className="font-display" style={{ fontSize: 22, color: "var(--forest)", marginBottom: 10, fontWeight: 500 }}>{v.title}</div>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/about" style={{ fontSize: 14, fontWeight: 600, color: "var(--forest)", textDecoration: "none", borderBottom: "1px solid var(--forest)", paddingBottom: 2 }}>
            Read the full story →
          </Link>
        </div>
      </section>

      {/* ===== Purpose (on-page section, id="purpose") ===== */}
      <section id="purpose" style={{ background: "var(--sage)", padding: "80px 24px", scrollMarginTop: 150 }}>
        <div style={{ maxWidth: 780, margin: "0 auto 48px", textAlign: "center" }}>
          <Reveal>
            <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--ochre-dark)", marginBottom: 16, textTransform: "uppercase" }}>Purpose</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,5vw,44px)", color: "var(--forest-dark)", fontWeight: 500, marginBottom: 20 }}>
              Where every rupee goes.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
              K25 isn't tied to one cause — it moves toward whatever genuine need the community
              surfaces each month, weighted toward education first.
            </p>
          </Reveal>
        </div>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 100}>
              <div style={{
                display: "flex", gap: 28, padding: "28px 0",
                borderTop: i === 0 ? "1px solid rgba(31,77,61,0.15)" : "none",
                borderBottom: "1px solid rgba(31,77,61,0.15)",
              }}>
                <div className="font-mono" style={{ fontSize: 14, color: "var(--ochre-dark)", flexShrink: 0, paddingTop: 4 }}>{p.num}</div>
                <div>
                  <h3 className="font-display" style={{ fontSize: 22, color: "var(--forest-dark)", fontWeight: 500, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8, maxWidth: 560 }}>{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/purpose" style={{ fontSize: 14, fontWeight: 600, color: "var(--forest-dark)", textDecoration: "none", borderBottom: "1px solid var(--forest-dark)", paddingBottom: 2 }}>
            See full breakdown →
          </Link>
        </div>
      </section>

      {/* ===== Gallery (on-page section, id="gallery") ===== */}
      <section id="gallery" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 120px", scrollMarginTop: 150 }}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}>
          <Reveal>
            <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--ochre-dark)", marginBottom: 16, textTransform: "uppercase" }}>Gallery</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,5vw,44px)", color: "var(--ink)", fontWeight: 500, marginBottom: 16 }}>
              Moments, not metrics.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
              A look at where the month's contributions actually landed.
            </p>
          </Reveal>
        </div>
        <div style={{ columns: "3 260px", columnGap: 16 }}>
          {GALLERY_PREVIEW.map((src, i) => (
            <Reveal key={i} delay={(i % 4) * 80} style={{ breakInside: "avoid", marginBottom: 16 }}>
              <div style={{
                borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)",
                aspectRatio: i % 3 === 0 ? "3/4" : "4/5",
              }}>
                <img
                  src={src}
                  alt={`K25 community moment ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/gallery" style={{ fontSize: 14, fontWeight: 600, color: "var(--forest)", textDecoration: "none", borderBottom: "1px solid var(--forest)", paddingBottom: 2 }}>
            View full gallery →
          </Link>
        </div>
      </section>
    </div>
  );
}