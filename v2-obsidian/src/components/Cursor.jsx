import { useEffect, useRef } from 'react';

/**
 * Magnetic two-part cursor: a lagging ring (lerp 0.16) + a 1:1 dot,
 * blended with mix-blend-mode:difference. Any element carrying a
 * `data-cursor` attribute (plus all a/button) expands the ring and
 * surfaces that attribute's text — e.g. "VIEW PROJECT" / "DRAG".
 * Disabled entirely on coarse pointers so nothing depends on hover.
 */
export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const SEL = 'a, button, [data-cursor]';

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onOver = (e) => {
      const el = e.target.closest?.(SEL);
      if (!el) return;
      ring.classList.add('is-hover');
      dot.classList.add('is-hover');
      label.textContent = el.getAttribute('data-cursor') || '';
    };
    const onOut = (e) => {
      const el = e.target.closest?.(SEL);
      if (!el) return;
      // ignore moves that stay within an interactive element
      if (e.relatedTarget?.closest?.(SEL)) return;
      ring.classList.remove('is-hover');
      dot.classList.remove('is-hover');
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ringRef}>
        <span className="cursor__label" ref={labelRef} />
      </div>
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
