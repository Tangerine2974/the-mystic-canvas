import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/** Editorial studio statement on the asymmetric 12-col grid (lead 1–7, aside 9–12). */
export default function Manifesto() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="mani container" id="studio" ref={root}>
      <div className="mani__grid">
        <h2 className="mani__lead reveal">
          We compose interiors as <em>still cinema</em> — raw concrete, warm timber,
          and the slow theatre of light moving across a room.
        </h2>
        <div className="mani__aside reveal">
          <span className="mono-label">The Studio — 01</span>
          <p>An Indore practice shaping apartments, houses and hospitality with material
             honesty and editorial restraint.</p>
          <p>Every project begins with shadow, proportion, and the path of the
             afternoon sun.</p>
        </div>
      </div>
      <figure className="mani__figure reveal">
        <img src={`${import.meta.env.BASE_URL}assets/editorial-01.jpg`} alt="Warm timber and stone interior, Indore" loading="lazy" />
      </figure>
    </section>
  );
}
