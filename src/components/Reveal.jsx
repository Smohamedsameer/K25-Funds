import { useEffect, useRef, useState } from "react";

/* Scroll-reveal wrapper — fades/rises content in once as it enters the viewport. */
export default function Reveal({ children, delay = 0, style, as: Tag = "div" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? " in-view" : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
