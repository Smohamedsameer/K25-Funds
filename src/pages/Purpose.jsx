import Reveal from "../components/Reveal.jsx";

const PILLARS = [
  { num: "01", title: "Education Support", text: "School fees, books, uniforms, and tuition for students whose families are stretched thin this term." },
  { num: "02", title: "Emergency Good Deeds", text: "Quiet, quick help — a medical bill, a repair, a meal — for someone in the community who needs it now, not after a form is processed." },
  { num: "03", title: "Community Requests", text: "Any member can flag a genuine need; the group reviews and decides together where the month's fund goes." },
];

export default function Purpose() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "160px 24px 40px", textAlign: "center" }}>
        <Reveal>
          <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--ochre-dark)", marginBottom: 16, textTransform: "uppercase" }}>Purpose</div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="font-display" style={{ fontSize: "clamp(32px,6vw,52px)", color: "var(--ink)", fontWeight: 500, marginBottom: 20 }}>
            Where every rupee goes.
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            K25 isn't tied to one cause — it moves toward whatever genuine need the community
            surfaces each month, weighted toward education first.
          </p>
        </Reveal>
      </section>

      <section style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 100px" }}>
        {PILLARS.map((p, i) => (
          <Reveal key={p.num} delay={i * 100}>
            <div style={{
              display: "flex", gap: 28, padding: "32px 0",
              borderTop: i === 0 ? "1px solid var(--line)" : "none",
              borderBottom: "1px solid var(--line)",
            }}>
              <div className="font-mono" style={{ fontSize: 14, color: "var(--ochre-dark)", flexShrink: 0, paddingTop: 4 }}>{p.num}</div>
              <div>
                <h3 className="font-display" style={{ fontSize: 24, color: "var(--forest)", fontWeight: 500, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8, maxWidth: 560 }}>{p.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section style={{ background: "var(--sage)", padding: "70px 24px" }}>
        <Reveal>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px,4vw,32px)", color: "var(--forest-dark)", fontWeight: 500, marginBottom: 14 }}>
              Full accountability, always.
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
              Every contribution and every expense is logged with a receipt, reviewed by the
              admin, and reflected in that month's running balance — visible to the whole group.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
