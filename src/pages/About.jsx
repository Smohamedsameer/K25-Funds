import Reveal from "../components/Reveal.jsx";

const VALUES = [
  { title: "Transparent", text: "Every contribution and expense is logged and visible to the group — no black boxes." },
  { title: "Capped & Personal", text: "Membership is limited by design, so this stays a circle of people who know each other, not an anonymous fund." },
  { title: "Zero Overhead", text: "There's no office, no salary, no cut taken. Every rupee raised goes toward the cause it was raised for." },
];

export default function About() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <section style={{
        position: "relative", minHeight: "50vh", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80"
            alt="Community hands together"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,77,61,0.6), rgba(23,20,15,0.8))" }} />
        </div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "160px 24px 60px", maxWidth: 700 }}>
          <Reveal>
            <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "rgba(255,255,255,0.75)", marginBottom: 16, textTransform: "uppercase" }}>About Us</div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display" style={{ fontSize: "clamp(32px,6vw,54px)", color: "#fff", fontWeight: 500 }}>
              A circle of 26, giving on purpose.
            </h1>
          </Reveal>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 40px" }}>
        <Reveal>
          <p style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.9, marginBottom: 24 }}>
            K25 started as an idea between friends: what if a small, trusted group set aside a
            fixed amount every month and put it directly toward education support and good deeds
            in our own community — no paperwork, no waiting on approvals, no cut lost to overhead?
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.9 }}>
            The name comes from the cap on membership — exactly 26 contributors, no more. That
            limit is intentional. It keeps K25 a circle of people who actually know why the money
            matters, rather than an anonymous donation box.
          </p>
        </Reveal>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {VALUES.map((v, i) => (
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
      </section>
    </div>
  );
}
