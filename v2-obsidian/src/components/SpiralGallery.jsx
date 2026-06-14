import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

// BASE_URL = '/the-mystic-canvas/' in the Pages build, '/' in dev — keeps photo paths correct on both
const BASE = import.meta.env.BASE_URL;
const FEATURES = [
  { img: `${BASE}assets/feature-01.jpg`, title: 'Teal Chamber',     tag: 'Apartment · Bedroom' },
  { img: `${BASE}assets/feature-02.jpg`, title: 'Velvet Pavilion',  tag: 'Residence · Living' },
  { img: `${BASE}assets/feature-03.jpg`, title: 'Teak Niche',       tag: 'Atelier · Dressing' },
  { img: `${BASE}assets/feature-04.jpg`, title: 'Carved Threshold', tag: 'Hospitality · Foyer' },
  { img: `${BASE}assets/feature-05.jpg`, title: 'Brass Refectory',  tag: 'Residence · Dining' },
  { img: `${BASE}assets/feature-06.jpg`, title: 'Stone Veranda',    tag: 'House · Threshold' },
  { img: `${BASE}assets/feature-07.jpg`, title: 'Jaali Study',      tag: 'Residence · Study' },
  { img: `${BASE}assets/feature-08.jpg`, title: 'Cane Lounge',      tag: 'Apartment · Living' },
  { img: `${BASE}assets/feature-09.jpg`, title: 'Marble Galley',    tag: 'Residence · Kitchen' },
  { img: `${BASE}assets/feature-10.jpg`, title: 'Arched Salon',     tag: 'Hospitality · Lounge' },
  { img: `${BASE}assets/feature-11.jpg`, title: 'Indigo Suite',     tag: 'Hotel · Suite' },
  { img: `${BASE}assets/feature-12.jpg`, title: 'Terrazzo Bath',    tag: 'Residence · Bath' },
  { img: `${BASE}assets/feature-13.jpg`, title: 'Walnut Library',   tag: 'House · Library' },
  { img: `${BASE}assets/feature-14.jpg`, title: 'Courtyard Edit',   tag: 'House · Courtyard' },
];

/* Two tuned profiles. Desktop spreads the full set on a denser curve; MOBILE IS THE
   UNTOUCHED 6-card deck (same constants, same count it has always shipped with). */
const VIEW = {
  desktop: { count: 14, A: 200, STEP: 0.52, scaleMul: 0.080, scaleFloor: 0.40, opMul: 0.14, zMul: 165 },
  mobile:  { count: 6,  A: 165, STEP: 0.72, scaleMul: 0.110, scaleFloor: 0.56, opMul: 0.20, zMul: 200 },
};

// Golden logarithmic spiral:  r = A · e^(Bθ),  B = ln(φ)/(π/2) → φ growth per quarter-turn.
const PHI = 1.61803398875;
const B = Math.log(PHI) / (Math.PI / 2);  // ≈ 0.3063

export default function SpiralGallery() {
  const reduced = useReducedMotion();

  // viewport gate — mobile renders the exact deck it always has; desktop gets the dense set
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 721px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 721px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const view = isDesktop ? VIEW.desktop : VIEW.mobile;
  const cards = FEATURES.slice(0, view.count);

  const stageRef = useRef(null);
  const itemRefs = useRef([]);
  const pos = useRef(0);          // continuous index
  const vel = useRef(0);
  const target = useRef(0);       // discrete room the spiral settles onto
  const dragging = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    const v = isDesktop ? VIEW.desktop : VIEW.mobile;
    const N = v.count;
    const { A, STEP, scaleMul, scaleFloor, opMul, zMul } = v;

    // keep position valid when the count changes between profiles
    pos.current = Math.max(0, Math.min(N - 1, pos.current));
    target.current = Math.max(0, Math.min(N - 1, target.current));

    // size cards to the stage (mobile uses --card-h; desktop overrides to a fixed 4:3 in CSS)
    const sizeCards = () => stage.style.setProperty('--card-h', (stage.clientHeight * 0.9) + 'px');
    sizeCards();
    const ro = new ResizeObserver(sizeCards);
    ro.observe(stage);

    let raf = 0;
    let lastPos = NaN;   // idle gate — only touch the DOM when the deck actually moves

    const render = () => {
      if (!dragging.current) {
        pos.current += vel.current;
        vel.current *= 0.9;                                       // decelerating momentum
        pos.current += (target.current - pos.current) * 0.08;     // settle onto the chosen room
        if (Math.abs(vel.current) < 0.0008 && Math.abs(target.current - pos.current) < 0.001) {
          pos.current = target.current;                           // at rest
        }
      }
      pos.current = Math.max(0, Math.min(N - 1, pos.current));

      const moving = dragging.current
        || Math.abs(vel.current) > 0.00006
        || Math.abs(pos.current - lastPos) > 0.0005
        || lastPos !== lastPos;                                   // NaN → first frame
      if (moving) {
        for (let i = 0; i < N; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const p = i - pos.current;            // 0 = foreground focal
          const theta = p * STEP;
          const r = A * Math.exp(B * theta);
          const x = Math.sin(theta) * r;
          const y = -Math.cos(theta) * r + A;   // focal lands at stage centre
          const dist = Math.abs(p);
          const scale = Math.max(scaleFloor, 1 - dist * scaleMul);
          const z = -dist * zMul;
          const opacity = Math.max(0, 1 - dist * opMul);
          // translate(-50%,-50%) centres each card on its spiral point (focal → dead centre)
          el.style.transform =
            `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${x * 0.04}deg) rotateX(${-y * 0.016}deg) scale(${scale})`;
          el.style.opacity = opacity;
          el.style.zIndex = String(Math.round(100 - dist * 10));
        }
        lastPos = pos.current;
        const a = Math.round(pos.current);
        setActive((prev) => (prev !== a ? a : prev));
      }
      raf = requestAnimationFrame(render);
    };
    render();

    const clampIdx = (x) => Math.max(0, Math.min(N - 1, x));
    const onWheel = (e) => {
      e.preventDefault();
      vel.current += e.deltaY * 0.0007;
      target.current = clampIdx(Math.round(pos.current + vel.current * 6));  // aim where the throw lands
    };
    stage.addEventListener('wheel', onWheel, { passive: false });

    let lastX = 0;
    const onDown = (e) => { dragging.current = true; lastX = e.clientX; vel.current = 0; stage.setPointerCapture?.(e.pointerId); };
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX; lastX = e.clientX;
      const d = -dx * 0.0045;                 // heavier travel to match the larger cards
      pos.current += d; vel.current = d;      // carry momentum on release
    };
    const onUp = (e) => {
      dragging.current = false;
      target.current = clampIdx(Math.round(pos.current));   // snap to nearest room
      stage.releasePointerCapture?.(e.pointerId);
    };
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [reduced, isDesktop]);

  // discrete navigation — accumulates correctly across rapid presses via the target ref
  const step = (delta) => {
    const N = cards.length;
    target.current = Math.max(0, Math.min(N - 1, Math.round(target.current) + delta));
    vel.current += (target.current - pos.current) * 0.03;
  };
  const goTo = (i) => {
    target.current = i;
    vel.current += (i - pos.current) * 0.03;
  };

  // Reduced-motion: a calm, fully legible grid — no rAF, no transforms.
  if (reduced) {
    return (
      <section className="spiral container" id="work">
        <div className="spiral__head">
          <h2 className="spiral__title">Selected <em>Rooms</em></h2>
          <span className="mono-label">{cards.length} Projects</span>
        </div>
        <div className="spiral__fallback">
          {cards.map((f) => (
            <figure className="spiral__item--static" key={f.img}>
              <img src={f.img} alt={f.title} loading="lazy" />
              <figcaption><h3>{f.title}</h3><span className="mono-label">{f.tag}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="spiral spiral--deck" id="work">
      <div className="spiral__head container">
        <h2 className="spiral__title">Selected <em>Rooms</em></h2>
        <span className="mono-label">Golden spiral · drag to advance</span>
      </div>
      <div className="spiral__body">
        <div className="spiral__intro spiral__intro--l" aria-hidden="true" />
        <div className="spiral__stage" ref={stageRef} data-cursor="DRAG">
          {cards.map((f, i) => (
            <article
              className="spiral__item"
              key={f.img}
              ref={(el) => (itemRefs.current[i] = el)}
              onClick={() => goTo(i)}
              data-cursor="VIEW PROJECT"
            >
              <figure>
                <img src={f.img} alt={f.title} draggable="false" />
                <figcaption className="spiral__cap">
                  <h3>{f.title}</h3>
                  <span className="mono-label">{f.tag}</span>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
        <div className="spiral__intro spiral__intro--r" aria-hidden="true" />
      </div>
      <div className="spiral__controls">
        <button className="spiral__btn" onClick={() => step(-1)} aria-label="Previous room">←</button>
        <div className="spiral__dots" role="tablist">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`spiral__dot ${i === active ? 'is-on' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to room ${i + 1}`}
              aria-selected={i === active}
            />
          ))}
        </div>
        <button className="spiral__btn" onClick={() => step(1)} aria-label="Next room">→</button>
      </div>
    </section>
  );
}
