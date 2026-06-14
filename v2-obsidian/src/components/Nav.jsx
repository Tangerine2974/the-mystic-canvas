export default function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" href="#top" data-cursor="TOP">
        The Mystic <em>Canvas</em>
      </a>
      <nav className="nav__links" aria-label="Primary">
        <a href="#work" data-cursor="VIEW">Works</a>
        <a href="#studio" data-cursor="READ">Studio</a>
        <a href="#contact" data-cursor="SAY HELLO">Contact</a>
      </nav>
    </header>
  );
}
