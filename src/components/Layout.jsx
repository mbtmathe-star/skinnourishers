import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Facebook, Instagram, Mail, MapPin, Menu, MessageCircle, Phone,
  Volume2, VolumeX, X
} from 'lucide-react';
import { Button } from './ui';
import { useBooking } from './BookingModal';

// Lets a treatment page tell the floating WhatsApp button which treatment the
// visitor is reading about, so the opening message names it (Section 09).
const WhatsAppTopicContext = createContext({ topic: '', setTopic: () => {} });
export function useWhatsAppTopic(topic) {
  const { setTopic } = useContext(WhatsAppTopicContext);
  useEffect(() => {
    if (!topic) return undefined;
    setTopic(topic);
    return () => setTopic('');
  }, [topic, setTopic]);
}

const navigation = [
  { name: 'Treatments', path: '/services' },
  { name: 'Results', path: '/results' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { openBooking } = useBooking();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b" style={{ borderColor: 'var(--line)' }}>
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-lg lg:text-xl leading-none">
              <span className="font-heading font-light text-foreground">SKIN</span>{' '}
              <span className="font-heading font-semibold text-foreground">Nourishers</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-8">
            {navigation.map((item) => (
              <Link key={item.path} to={item.path} className="text-sm font-body transition-colors" style={{ color: location.pathname === item.path ? 'hsl(var(--foreground))' : 'var(--fg-muted)', fontWeight: location.pathname === item.path ? 500 : 400 }}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <a href="tel:+27788210150" className="flex items-center gap-2 transition-colors text-sm" style={{ color: 'var(--fg-muted)' }}>
              <Phone className="w-4 h-4" /><span className="font-body">+27 78 821 0150</span>
            </a>
            <button type="button" onClick={() => openBooking({})} className="inline-flex items-center justify-center font-mono uppercase px-6 h-10 text-[11px]" style={{ border: '1px solid var(--line-strong)', borderRadius: '2px', letterSpacing: '.08em', color: 'hsl(var(--foreground))' }}>
              Free Consultation
            </button>
          </div>

          <div className="xl:hidden flex items-center gap-3">
            <button className="p-2 text-foreground" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="xl:hidden bg-background border-t" style={{ borderColor: 'var(--line)' }}>
            <nav className="container py-4 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link key={item.path} to={item.path} className="py-3 px-4 font-body text-sm transition-colors" style={{ borderRadius: '2px', color: location.pathname === item.path ? 'hsl(var(--foreground))' : 'var(--fg-muted)', background: location.pathname === item.path ? 'hsl(var(--muted))' : 'transparent' }}>
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                <button type="button" onClick={() => { setOpen(false); openBooking({}); }} className="w-full h-10 inline-flex items-center justify-center font-mono uppercase text-[11px]" style={{ border: '1px solid var(--line-strong)', borderRadius: '2px', letterSpacing: '.08em' }}>Free Consultation</button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative">
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col items-start mb-6">
              <span className="font-heading text-3xl text-background">Skin Nourishers</span>
              <span className="text-xs uppercase tracking-wide-elegant text-background/40 font-body mt-1">Aesthetic Clinic</span>
            </Link>
            <p className="text-background/50 text-sm leading-relaxed font-body mb-8">Premier aesthetic clinic specializing in non-invasive beauty treatments with state of the art technology and personalized care.</p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-background/20 rounded-full flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-background/20 rounded-full flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide-elegant text-primary mb-6 font-body">Quick Links</h4>
            <ul className="space-y-3">
              {[['Home','/'],['Treatments','/services'],['Pricing','/pricing'],['Results','/results'],['About Us','/about'],['Blog','/blog'],['Contact','/contact']].map(([name,path]) => <li key={path}><Link to={path} className="text-background/50 hover:text-primary transition-colors text-sm font-body">{name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide-elegant text-primary mb-6 font-body">Treatments</h4>
            <ul className="space-y-3">{['Face Treatments','Laser Hair Removal - Ladies','Fibroblast Plasma','Waxing','Threading'].map((name) => <li key={name} className="text-background/50 text-sm font-body">{name}</li>)}</ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide-elegant text-primary mb-6 font-body">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" /><span className="text-background/50 text-sm font-body">100 South Road, Morning View<br />Shopping Centre, Sandton, 2191</span></li>
              <li><a href="tel:+27788210150" className="flex items-center gap-3 text-background/50 hover:text-primary transition-colors text-sm font-body"><Phone className="h-4 w-4 text-primary flex-shrink-0" />+27 78 821 0150</a></li>
              <li><a href="mailto:info@skinnourishers.co.za" className="flex items-center gap-3 text-background/50 hover:text-primary transition-colors text-sm font-body"><Mail className="h-4 w-4 text-primary flex-shrink-0" />info@skinnourishers.co.za</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/30 text-xs font-body uppercase tracking-elegant">© {new Date().getFullYear()} Skin Nourishers. All rights reserved.</p>
          <div className="flex gap-8 text-xs font-body uppercase tracking-elegant"><Link to="/privacy" className="text-background/30 hover:text-primary transition-colors">Privacy</Link><Link to="/terms" className="text-background/30 hover:text-primary transition-colors">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const { topic } = useContext(WhatsAppTopicContext);
  const message = topic
    ? `Hi! I'd like to book ${topic} at Skin Nourishers.`
    : "Hi! I'd like to book an appointment at Skin Nourishers.";
  const href = `https://wa.me/27788210150?text=${encodeURIComponent(message)}`;
  return <motion.a href={href} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-sm shadow-lg hover:shadow-xl transition-shadow group" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: 'spring', stiffness: 200 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}><MessageCircle className="h-6 w-6 fill-white" /><span className="font-medium hidden sm:inline">Chat with us</span><span className="absolute inset-0 rounded-sm bg-[#25D366] animate-ping opacity-25" /></motion.a>;
}

function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [tip, setTip] = useState(true);
  const audioRef = useRef(null);
  useEffect(() => { const timer = setTimeout(() => setTip(false), 5000); return () => clearTimeout(timer); }, []);
  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { try { audioRef.current.volume = .6; await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); } }
    setTip(false);
  };
  return <div className="fixed bottom-24 right-4 z-50 lg:bottom-6"><audio ref={audioRef} src="/audio/ambient-spa.mp3" loop preload="auto" />{tip && <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-xl whitespace-nowrap"><p className="text-sm text-foreground">Tap to enjoy ambient sound</p></div>}<Button onClick={toggle} size="icon" variant="outline" className={`rounded-full h-12 w-12 shadow-lg backdrop-blur-md transition-all ${playing ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30' : 'bg-card/80 hover:bg-card'}`} aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}>{playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}</Button></div>;
}

export default function Layout({ children }) {
  const [topic, setTopic] = useState('');
  return (
    <WhatsAppTopicContext.Provider value={{ topic, setTopic }}>
      <div className="min-h-screen flex flex-col"><Header /><main className="flex-1">{children}</main><Footer /><FloatingWhatsApp /><AmbientSound /></div>
    </WhatsAppTopicContext.Provider>
  );
}
