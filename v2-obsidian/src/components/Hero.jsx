import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * Full-viewport cinematic hero. The video layer scrubs scale 1 → 1.15 and the
 * headline parallaxes up + fades as the section scrolls past — both bound to a
 * single ScrollTrigger. Static (no scrub, no autoplay motion) under reduced-motion.
 */
export default function Hero() {
  const root = useRef(null);
  const media = useRef(null);
  const inner = useRef(null);
  const video = useRef(null);
  const reduced = useReducedMotion();

  // Force-mute + kick playback (React doesn't always reflect `muted` to the attribute).
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, []);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(media.current, { scale: 1.15, ease: 'none', scrollTrigger: st });
      gsap.to(inner.current, { yPercent: -24, opacity: 0.12, ease: 'none', scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__media" ref={media}>
        <video
          ref={video}
          src="/assets/hero.mp4"
          poster="/assets/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
      <div className="hero__scrim" />
      <div className="hero__inner" ref={inner}>
        <p className="mono-label hero__tag">Interior Architecture — Indore, IN</p>
        <h1 className="hero__title">
          The Mystic <em>Canvas</em><span className="dot">.</span>
        </h1>
      </div>
      <div className="hero__meta">
        <p className="mono-label">Obsidian rooms · travertine · warm shadow</p>
        <p className="mono-label">22.72°N 75.86°E</p>
      </div>
    </section>
  );
}
