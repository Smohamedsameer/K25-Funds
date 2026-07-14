import Reveal from "../components/Reveal.jsx";

const PHOTOS = [
  "./group1.jpg",
  "./group3.jpg",
  "./group2.jpg",
  "./group8.jpg",
  "./group4.jpg",
  "./group6.jpg",
  "./group7.jpeg",
  "./group5.jpeg",
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
