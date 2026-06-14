import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#work', label: 'Works' },
  { href: '#studio', label: 'Studio' },
  { href: '#contact', label: 'Contact' },
];

/**
 * Mobile navigation drawer. Pure React state (useState) — open/close is a single
 * lightweight toggle, dismissable via the toggle, any link, or Escape. The panel is
 * position:fixed and does NOT lock body scroll (no overflow:hidden on <body>), so the
 * viewport is never frozen. Desktop never renders it (the toggle is display:none ≥721px).
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Escape closes; listener only attached while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        className="nav__toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobileMenu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <div
        id="mobileMenu"
        className={`mobilemenu ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <nav className="mobilemenu__panel" aria-label="Mobile">
          <span className="mono-label mobilemenu__tag">The Mystic Canvas — Index</span>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mobilemenu__link"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
