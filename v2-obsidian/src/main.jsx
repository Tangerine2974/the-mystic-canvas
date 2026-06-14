import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/tokens.css';
import './styles/app.css';
import App from './App.jsx';

// Register once, app-wide — components just declare `scrollTrigger` configs.
gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById('root')).render(<App />);
