import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import MobileMenu from './components/MobileMenu.jsx';
import Hero from './components/Hero.jsx';
import Manifesto from './components/Manifesto.jsx';
import SpiralGallery from './components/SpiralGallery.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <MobileMenu />
      <main>
        <Hero />
        <Manifesto />
        <SpiralGallery />
        <Contact />
      </main>
    </>
  );
}
