import Reveal from "../components/Reveal.jsx";

const PHOTOS = [
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
  "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80",
];

export default function Gallery() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "160px 24px 40px", textAlign: "center" }}>
        <Reveal>
          <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--ochre-dark)", marginBottom: 16, textTransform: "uppercase" }}>Gallery</div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="font-display" style={{ fontSize: "clamp(32px,6vw,52px)", color: "var(--ink)", fontWeight: 500, marginBottom: 16 }}>
            Moments, not metrics.
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            A look at where the month's contributions actually landed.
          </p>
        </Reveal>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 120px" }}>
        <div style={{ columns: "3 260px", columnGap: 16 }}>
          {PHOTOS.map((src, i) => (
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
      </section>
    </div>
  );
}
