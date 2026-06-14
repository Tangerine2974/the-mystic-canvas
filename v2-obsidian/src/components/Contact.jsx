export default function Contact() {
  return (
    <section className="contact container" id="contact">
      <div className="contact__grid">
        <h2 className="contact__title">Let’s compose<br />your <em>space</em>.</h2>
        <div className="contact__side">
          <span className="mono-label">Begin a project</span>
          <a className="contact__email" href="mailto:design@themysticcanvas.com" data-cursor="SAY HELLO">
            design@themysticcanvas.com <span className="ar" aria-hidden="true">↗</span>
          </a>
          <p>Indore, Madhya Pradesh<br />By appointment</p>
        </div>
      </div>
      <div className="contact__foot">
        <span className="mono-label">© 2026 The Mystic Canvas</span>
        <span className="mono-label">Noir Concept — v2</span>
      </div>
    </section>
  );
}
