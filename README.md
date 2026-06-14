# The Mystic Canvas

A luxury, immersive showcase for an interior-design studio — built as a single-page
experience where the interface itself behaves like art direction. Obsidian palette,
oversized editorial serif, and motion that is felt more than seen.

> The production front-end lives in [`v2-obsidian/`](v2-obsidian) — a clean Vite + React
> SPA. The earlier light-theme prototype is preserved locally as
> `old-index.reference.html` (untracked) so no historical work is lost.

## Stack

- **Vite** — instant dev server, lean production build.
- **React 18** — component-driven UI, no framework ceremony.
- **GSAP** (+ ScrollTrigger) — the motion layer: scroll-bound deck transitions, hero
  settle, and staggered section reveals.

## Key mechanics

- **Staggered parallax timelines.** Sections rise and settle on scroll through GSAP
  ScrollTrigger; the hero video scrubs scale and opacity against scroll position so it
  reads as one continuous, art-directed move rather than a static backdrop.

- **The Golden Spiral gallery (desktop).** Project photography is arranged along a true
  logarithmic spiral — `r = A · e^(Bθ)`, golden growth per quarter-turn — as a 14-card
  deck that cycles through the work. The active card locks to the exact horizontal and
  vertical centre of the layout at a bold 400px, while trailing cards step down in scale
  and opacity to hand focus to the centre. The whole stage is held to a tight 70vh
  envelope, leaving elegant breathing-room columns on the outer left and right.

- **A fluid, non-blocking mobile drawer.** A lightweight React-state menu
  (`MobileMenu.jsx`) that opens and dismisses instantly — toggle, link, or Escape — and
  never locks the viewport. All desktop spiral math is media-query-scoped, so the mobile
  view stays deliberately untouched.

- **Custom magnetic cursor.** A blend-mode cursor that expands and surfaces intent
  ("VIEW PROJECT", "DRAG") over interactive elements, and steps aside entirely on touch.

## Design system

Obsidian dark, every pair tuned for contrast on `#0D0D0D`:

| Token         | Value     | Role                          |
| ------------- | --------- | ----------------------------- |
| `--bg`        | `#0D0D0D` | base                          |
| `--bg-raise`  | `#141414` | raised surfaces               |
| `--bg-float`  | `#1A1916` | floating cards                |
| `--text`      | `#F4F1EC` | primary linen text            |
| `--text-mute` | `#9A938A` | secondary                     |
| `--sand`      | `#C9A877` | single architectural accent   |

Type — **Fraunces** (display serif) · **Hanken Grotesk** (body) · **JetBrains Mono**
(micro-labels and wayfinding numerals).

## Getting started

```bash
cd v2-obsidian
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`). For a production build:

```bash
npm run build
```

---

© The Mystic Canvas — Indore. Photography belongs to the studio.
