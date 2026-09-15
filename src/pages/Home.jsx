import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Layout from '../components/Layout';
import catalog from '../data/services-catalog.json';
import reviews from '../data/reviews.json';
import { useBooking } from '../components/BookingModal';
import { useInquiry } from '../components/InquiryModal';

const heroImages = [
  { image: '/assets/hero-spa-2-Dq40jLOj.jpg', position: 'center' },
  { image: '/assets/hero-spa-3-DzEEcpFL.jpg', position: 'center 30%' },
  { image: '/assets/hero-spa-4-DIKaffhK.jpg', position: 'center 30%' },
  { image: '/assets/hero-spa-5-pQT9dTcO.jpg', position: 'center' },
  { image: '/assets/hero-spa-6-m4zNynn7.jpg', position: 'center' },
  { image: '/assets/hero-spa-7-24dnnZ-x.jpg', position: 'center' },
];

const rand = (n) => {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return 'R' + grouped + (cents ? ',' + String(cents).padStart(2, '0') : '');
};

const totalServices = catalog.reduce((n, g) => n + g.services.length, 0);
const countIn = (category) => (catalog.find((g) => g.category === category)?.services.length ?? 0);

// Our own tier vocabulary, mapped to the reference's three depth bands so the
// card accents and the explainer agree with how /pricing already groups things.
const DEPTH = {
  'Facials & Skin Health': 'surface',
  'Face': 'surface',
  'Brows & Eyes': 'surface',
  'Shaping': 'surface',
  'Tinting': 'surface',
  'Massage & Body Care': 'surface',
  'Brow & Lash Combos': 'surface',
  'Resurfacing & Rejuvenation': 'dermal',
  'Contouring & Firming': 'dermal',
  'Arms, Underarms & Body': 'dermal',
  'Legs & Intimate': 'dermal',
  'Face & Neck': 'dermal',
  'Arms, Body & Back': 'dermal',
  'Lifting & Structural': 'structural',
  'Advanced & Restorative': 'structural',
  'Advanced Combos': 'structural',
};

const MOST_BOOKED = [
  'Ladies & Teen - Hollywood Wax', 'Laser - Full Leg', 'Laser - Underarm', 'Dermaplaning',
  'Jet Plasma Ozone', 'Oxygen Therapy Facial', 'Pigmentation', 'Skin Tag Removal',
  'Basic Facial', 'Microneedling', 'Ultraformer Non-Surgical Face Lift', 'Laser - Brazilian',
  'Ladies & Teen - Brazilian', 'Derma Peel', 'Acne Treatment', 'Brow Lamination',
  'Laser - Full Back', 'Cellulite Treatment', 'HIFU - Abdomen', 'Consultation',
];

function resolveMostBooked() {
  const out = [];
  MOST_BOOKED.forEach((name) => {
    for (const group of catalog) {
      const svc = group.services.find((s) => s.name === name);
      if (svc) { out.push({ ...svc, category: group.category }); return; }
    }
  });
  return out;
}

const CONCERNS = [
  'Acne & breakouts',
  'Pigmentation & dark marks',
  'Fine lines & sagging',
  'Unwanted hair',
  'Stretch marks & scarring',
  'Hair loss & thinning',
];

const DEPTH_BANDS = [
  {
    tier: 'Facials & Skin Health',
    title: 'Skin you can see today',
    body: 'Facials, dermaplaning, microdermabrasion, waxing, threading, brows and lashes. Immediate, visible, and easy to fit into a lunch hour.',
  },
  {
    tier: 'Resurfacing & Rejuvenation',
    title: 'Skin that rebuilds itself',
    body: 'Peels, microneedling, pigmentation and acne programmes, laser hair removal. These work below the surface and build over a course of sessions.',
  },
  {
    tier: 'Lifting & Structural',
    title: 'The layer that holds everything up',
    body: 'HIFU, Ultraformer, Fibroblast plasma, RF and Jet Plasma. Focused energy at the depth a surgeon would tighten, without surgery or downtime.',
  },
];

const HERO_STATS = [
  ['15+', 'Years treating skin'],
  [String(totalServices), 'Treatments offered'],
  ['4.7', 'Average rating on Booksy'],
  ['Free', '30-minute consultation'],
];

function HeroStats() {
  return (
    <div className="hero-stats" role="list" aria-label="Key clinic stats">
      {HERO_STATS.map(([n, t]) => (
        <div className="hero-stat" role="listitem" key={t}>
          <div className="hero-stat-n">{n}</div>
          <p className="hero-stat-t">{t}</p>
        </div>
      ))}
    </div>
  );
}

function HomeHero({ onOpenAssessment }) {
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive((v) => (v + 1) % heroImages.length), []);
  useEffect(() => { const timer = setInterval(next, 6000); return () => clearInterval(timer); }, [next]);
  return <section className="relative h-screen w-full overflow-hidden">
    {heroImages.map((image, index) => <motion.div key={image.image} initial={{ opacity: 0 }} animate={{ opacity: index === active ? 1 : 0 }} transition={{ duration: 1.5, ease: 'easeInOut' }} className="absolute inset-0" style={{ zIndex: index === active ? 1 : 0 }}><div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${image.image})`, backgroundPosition: image.position }} /></motion.div>)}
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent z-10" />
    <div className="container relative z-20 h-full flex items-center"><div className="max-w-xl"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }}><h1 className="d1 text-white mb-6">Experience<br /><span className="italic">Premium Skincare</span></h1><p className="font-body text-lg text-white/80 mb-10 max-w-md leading-relaxed">Personalized treatments for radiant, healthy skin. Begin with a complimentary consultation.</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .5 }}><button type="button" onClick={onOpenAssessment} className="btn-ref">Free Skin Assessment <ArrowRight className="h-4 w-4" /></button></motion.div></div></div>
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .7 }} className="absolute left-0 right-0 z-20" style={{ bottom: 'clamp(44px, 6vw, 64px)' }}><div className="container"><HeroStats /></div></motion.div>
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">{heroImages.map((_, index) => <button key={index} onClick={() => setActive(index)} className={`h-1 rounded-full transition-all duration-500 ${index === active ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} aria-label={`Go to slide ${index + 1}`} />)}</div>
  </section>;
}

function ConcernsGrid() {
  return (
    <section className="sec-mist sec-pad" id="concerns">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: .6 }} viewport={{ once: true }}>
            <img
              src="/assets/facial-treatment-BqmdQUGZ.jpg"
              alt="Skin treatment at Skin Nourishers"
              className="w-full aspect-[4/5] object-cover"
              style={{ borderRadius: 'calc(var(--radius) + 16px)', boxShadow: 'var(--shadow-lg)' }}
            />
          </motion.div>
          <div>
            <span className="eyebrow">Start here</span>
            <h2 className="d2 sec-h">What would you like to treat?</h2>
            <p className="lede sec-p">
              Most people know the problem, not the treatment that fixes it. Start with what is bothering
              you and we will show you what actually works for it.
            </p>
            <div className="concerns">
              {CONCERNS.map((c) => (
                <Link className="concern" to="/pricing" key={c}>
                  <span className="nm">{c}</span>
                  <span className="ar">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TIER_LABELS = ['Surface', 'Dermal', 'Structural'];

function DepthGraphic({ activeTier }) {
  const heights = ['18%', '58%', '100%'];
  const h = heights[activeTier];
  return (
    <div className="depth-graphic" style={{ position: 'sticky', top: 140, width: 240 }}>
      <div style={{ position: 'relative', width: 240, height: 400, borderRadius: 'calc(var(--radius) + 8px)', overflow: 'hidden', border: '1px solid hsl(var(--background) / .15)', boxShadow: 'var(--shadow-md)', background: 'hsl(var(--background) / .06)' }}>
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: h,
            background: 'linear-gradient(to top, hsl(var(--foreground)), hsl(var(--accent)))',
            transition: 'height .7s cubic-bezier(.22,.61,.36,1)',
          }}
        >
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: 'linear-gradient(to bottom, hsl(var(--background) / .35), transparent)' }} />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', left: '50%', top: `calc(100% - ${h})`, width: 10, height: 10,
            borderRadius: '50%', background: 'hsl(var(--background))', border: '2px solid hsl(var(--accent))',
            transform: 'translate(-50%, -50%)', transition: 'top .7s cubic-bezier(.22,.61,.36,1)',
          }}
        />
      </div>
      <div className="flex items-start justify-between mt-6" style={{ position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: 8, right: 8, top: 4, height: 1, background: 'hsl(var(--background) / .18)' }} />
        {TIER_LABELS.map((label, i) => (
          <div key={label} style={{ position: 'relative', textAlign: 'center', flex: 1 }}>
            <div
              aria-hidden="true"
              style={{
                width: 8, height: 8, margin: '0 auto', borderRadius: '50%',
                background: activeTier === i ? 'hsl(var(--background))' : 'hsl(var(--background) / .3)',
                boxShadow: activeTier === i ? '0 0 0 2px hsl(var(--accent))' : 'none',
                transition: 'all .3s',
              }}
            />
            <span className="eyebrow mt-2" style={{ color: activeTier === i ? 'hsl(var(--background))' : 'hsl(var(--background) / .4)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepthExplainer() {
  const [activeTier, setActiveTier] = useState(0);
  return (
    <section className="sec-ink sec-pad">
      <div className="container">
        <span className="eyebrow">How we think about treatment</span>
        <h2 className="d2 sec-h">Every treatment works at a different depth</h2>
        <p className="lede sec-p">
          A facial and a non-surgical lift are not competing options. They work on completely
          different layers. Knowing which layer your concern lives in is most of the answer.
        </p>
        <div className="depth-wrap">
          <div className="space-y-16" style={{ flex: '1 1 auto', minWidth: 0 }}>
            {DEPTH_BANDS.map((band, i) => (
              <motion.div key={band.tier} onViewportEnter={() => setActiveTier(i)} viewport={{ amount: 0.6, margin: '-30% 0px -30% 0px' }}>
                <span className="eyebrow">Tier 0{i + 1} &mdash; {TIER_LABELS[i]}</span>
                <h3 className="d3 mt-3 mb-3">{band.title}</h3>
                <p className="lede">{band.body}</p>
              </motion.div>
            ))}
          </div>
          <DepthGraphic activeTier={activeTier} />
        </div>
      </div>
    </section>
  );
}

function MostBooked() {
  const { openBooking } = useBooking();
  const picks = resolveMostBooked();
  return (
    <section className="sec-porcelain sec-pad">
      <div className="container">
        <span className="eyebrow">Most booked</span>
        <h2 className="d2 sec-h">Straight to the ones people come for.</h2>
        <p className="lede sec-p">
          Twenty treatments that make up most of what happens in the clinic. Pick one and the booking
          card opens with it already selected.
        </p>
        <div className="cards">
          {picks.map((svc) => (
            <article className="card-ref" data-tier={DEPTH[svc.tier] || 'dermal'} key={svc.category + svc.name}>
              <span className="card-tab" aria-hidden="true" />
              <span className="card-punch" aria-hidden="true" />
              <span className="card-tier">{svc.tier || svc.category}</span>
              <h3 className="card-name">{svc.name}</h3>
              <span className="card-rule" aria-hidden="true" />
              {svc.desc && <p className="card-blurb">{svc.desc}</p>}
              <div className="card-foot">
                <span className="card-price">
                  <span className="now">{rand(svc.price)}</span>
                  <span className="card-meta">{svc.duration}</span>
                </span>
                <button
                  type="button"
                  className="card-book"
                  onClick={() => openBooking({ category: svc.category, service: svc.name, title: svc.name })}
                >
                  Book
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LaserDoors() {
  const doors = [
    ['Ladies', countIn('Laser Hair Removal - Ladies'), 'Full body laser hair removal, from underarm and bikini through to full leg and face.'],
    ['Men', countIn('Laser Hair Removal - Men'), 'Back, chest, shoulders, beard line and full body. A menu built for men, not adapted for them.'],
    ['Teens', countIn('Laser Hair Removal - Teens'), 'Gentler settings and guardian consent, for teenagers who have had enough of shaving.'],
  ];
  return (
    <section className="sec-mist sec-pad">
      <div className="container">
        <span className="eyebrow">Laser hair removal</span>
        <h2 className="d2 sec-h">Treated properly, for everyone.</h2>
        <p className="lede sec-p">
          Skin, hair and expectations genuinely differ, so we run three separate laser menus rather
          than one adapted for everybody.
        </p>
        <div className="doors">
          {doors.map(([name, count, blurb], index) => (
            <Link className="door" to="/pricing" key={name} style={{ background: index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}>
              <span className="ct">{count} treatments</span>
              <h3>{name}</h3>
              <p>{blurb}</p>
              <span className="ct">Explore &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setActive((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);
  const review = reviews[active];
  return (
    <section className="sec-ink sec-pad" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container">
        <span className="eyebrow">From our clients</span>
        <h2 className="d2 sec-h">4.7 out of 5, and counting.</h2>
        <div className="max-w-3xl">
          <div className="relative" style={{ minHeight: 260 }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .4 }} className="absolute inset-0">
                <p className="d3 mb-6">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="eyebrow">
                  From {review.name}{review.badge ? ' · ' + review.badge : ''}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={() => setActive((v) => (v - 1 + reviews.length) % reviews.length)} className="card-book" aria-label="Previous review"><ChevronLeft className="w-4 h-4" /></button>
            <span className="eyebrow">{active + 1} / {reviews.length}</span>
            <button onClick={() => setActive((v) => (v + 1) % reviews.length)} className="card-book" aria-label="Next review"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onOpenAssessment }) {
  const { openBooking } = useBooking();
  return (
    <section className="sec-ash sec-pad" id="consultation">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <span className="eyebrow">No cost, no obligation</span>
            <h2 className="d2 sec-h">Start with a free consultation.</h2>
            <p className="lede mb-8">
              Thirty minutes, a proper look at your skin, and a plan with real prices attached. If
              nothing is worth doing yet, Sonia will tell you that too.
            </p>
            <div className="flex flex-wrap gap-4">
              <button type="button" onClick={onOpenAssessment} className="btn-ref">Book your free 30 minutes</button>
              <button type="button" onClick={() => openBooking({})} className="card-book">Book a treatment</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <span className="eyebrow">Visit</span>
              <p className="lede mt-3">100 South Road<br />Morning View Shopping Centre<br />Sandton, 2191</p>
            </div>
            <div>
              <span className="eyebrow">Hours</span>
              <p className="lede mt-3">Tue &ndash; Fri &nbsp;09:00 &ndash; 18:00<br />Saturday &nbsp;09:00 &ndash; 16:00<br />Sunday &amp; Monday &nbsp;Closed</p>
            </div>
            <div>
              <span className="eyebrow">Contact</span>
              <p className="lede mt-3">
                <a href="tel:+27788210150" className="hover:text-primary transition-colors">+27 78 821 0150</a><br />
                <a href="mailto:info@skinnourishers.co.za" className="hover:text-primary transition-colors">info@skinnourishers.co.za</a>
              </p>
            </div>
            <div>
              <span className="eyebrow">Explore</span>
              <p className="lede mt-3">
                <Link to="/pricing" className="hover:text-primary transition-colors">All treatments</Link><br />
                <Link to="/results" className="hover:text-primary transition-colors">Client results</Link><br />
                <Link to="/about" className="hover:text-primary transition-colors">About Sonia</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCTA() {
  const { openBooking } = useBooking();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <AnimatePresence>{visible && <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: .3 }} className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border py-3 px-4 lg:hidden"><div className="flex gap-3"><button type="button" onClick={() => openBooking({})} className="flex-1 inline-flex items-center justify-center h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm text-sm font-body"><CalendarDays className="h-4 w-4 mr-2" />Book Now</button></div></motion.div>}</AnimatePresence>;
}

export default function Home() {
  const { openInquiry } = useInquiry();
  const openAssessment = () => openInquiry({});
  return (
    <Layout>
      <HomeHero onOpenAssessment={openAssessment} />
      <ConcernsGrid />
      <DepthExplainer />
      <MostBooked />
      <LaserDoors />
      <Reviews />
      <FinalCTA onOpenAssessment={openAssessment} />
      <MobileStickyCTA />
    </Layout>
  );
}
