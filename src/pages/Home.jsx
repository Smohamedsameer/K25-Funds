import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
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

export default function Home() {
  const [summary, setSummary] = useState({ target: 2500, thisMonthIncome: 0, thisMonthCollected: 0, contributors: 0 });

  useEffect(() => {
    api.getSummary().then(setSummary).catch(() => {});
  }, []);

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section style={{
        position: "relative", minHeight: "92vh", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img
            src="./gate.jpg"
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
    </div>
  );
}