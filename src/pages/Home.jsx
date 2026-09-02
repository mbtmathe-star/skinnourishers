import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CalendarDays, ChevronLeft, ChevronRight,
  MapPin, Phone, Star, X
} from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui';
import treatments from '../data/treatments.json';
import reviews from '../data/reviews.json';
import skinConcerns from '../data/skin-concerns.json';
import treatmentOptions from '../data/treatment-options.json';
import { sendInquiry } from '../lib/inquiry';
import { useBooking } from '../components/BookingModal';

const heroImages = [
  { image: '/assets/hero-spa-2-Dq40jLOj.jpg', position: 'center' },
  { image: '/assets/hero-spa-3-DzEEcpFL.jpg', position: 'center 30%' },
  { image: '/assets/hero-spa-4-DIKaffhK.jpg', position: 'center 30%' },
  { image: '/assets/hero-spa-5-pQT9dTcO.jpg', position: 'center' },
  { image: '/assets/hero-spa-6-m4zNynn7.jpg', position: 'center' },
  { image: '/assets/hero-spa-7-24dnnZ-x.jpg', position: 'center' },
];

function HomeHero({ onOpenAssessment }) {
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive((v) => (v + 1) % heroImages.length), []);
  useEffect(() => { const timer = setInterval(next, 6000); return () => clearInterval(timer); }, [next]);
  return <section className="relative h-screen w-full overflow-hidden">
    {heroImages.map((image, index) => <motion.div key={image.image} initial={{ opacity: 0 }} animate={{ opacity: index === active ? 1 : 0 }} transition={{ duration: 1.5, ease: 'easeInOut' }} className="absolute inset-0" style={{ zIndex: index === active ? 1 : 0 }}><div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${image.image})`, backgroundPosition: image.position }} /></motion.div>)}
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent z-10" />
    <div className="container relative z-20 h-full flex items-center"><div className="max-w-xl"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }}><h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-[1.15]">Experience<br /><span className="italic">Premium Skincare</span></h1><p className="font-body text-lg text-white/80 mb-10 max-w-md leading-relaxed">Personalized treatments for radiant, healthy skin. Begin with a complimentary consultation.</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .5 }}><button type="button" onClick={onOpenAssessment} className="group inline-flex items-center bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-sm uppercase tracking-widest font-body font-medium rounded-full shadow-2xl shadow-primary/40">Free Skin Assessment <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" /></button></motion.div></div></div>
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">{heroImages.map((_, index) => <button key={index} onClick={() => setActive(index)} className={`h-1 rounded-full transition-all duration-500 ${index === active ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} aria-label={`Go to slide ${index + 1}`} />)}</div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: .8 }} className="absolute bottom-8 right-8 z-20 hidden md:block"><motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2"><span className="text-xs text-white/50 uppercase tracking-widest font-body">Scroll</span><div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" /></motion.div></motion.div>
  </section>;
}

function TreatmentsCarousel() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => { if (!auto) return; const timer = setInterval(() => setActive((v) => (v + 1) % treatments.length), 6000); return () => clearInterval(timer); }, [auto]);
  const previous = () => { setAuto(false); setActive((v) => (v - 1 + treatments.length) % treatments.length); };
  const next = () => { setAuto(false); setActive((v) => (v + 1) % treatments.length); };
  return <section className="py-10 lg:py-14 bg-background"><div className="container"><motion.div className="text-center mb-10 flex flex-col items-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-foreground">Expert Skin Care <span className="text-primary italic">Services</span></h2></motion.div><div className="relative"><div className="overflow-hidden rounded-2xl"><motion.div className="flex" animate={{ x: `-${active * 100}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{treatments.map((treatment) => <div key={treatment.id} className="min-w-full"><motion.div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500" whileHover={{ scale: 1.01 }}><div className="relative h-72 md:h-[450px] overflow-hidden bg-muted group">{treatment.video ? <video src={treatment.video} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" muted loop playsInline poster={treatment.image} /> : <img src={treatment.image} alt={treatment.category} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent" /></div><div className="bg-gradient-to-br from-secondary/50 to-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" /><span className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider mb-3"><span className="w-8 h-px bg-primary/50" />{treatment.duration} • {treatment.sessionsRecommended}</span><h3 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-6 relative">{treatment.category}</h3><p className="text-muted-foreground italic mb-4 border-l-2 border-primary/30 pl-4">{treatment.problem}</p><p className="text-foreground mb-8 line-clamp-3 leading-relaxed">{treatment.solution}</p><div className="flex flex-wrap gap-3"><Link to={`/services#${treatment.id}`} className="inline-flex items-center rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-primary-foreground px-5 py-2.5 text-sm font-medium">View Treatment <ArrowRight className="ml-2 h-4 w-4" /></Link><button type="button" onClick={() => openBooking({ category: treatment.category, title: treatment.category, options: (treatment.pricing || []).filter((p) => typeof p.price === 'number').map((p) => ({ name: p.area, price: p.price, duration: treatment.duration })) })} className="inline-flex items-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2 text-sm font-medium">Book Now</button></div></div></motion.div></div>)}</motion.div></div><button onClick={previous} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-foreground transition-all z-10"><ChevronLeft className="h-5 w-5" /></button><button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-foreground transition-all z-10"><ChevronRight className="h-5 w-5" /></button><div className="flex justify-center gap-2 mt-6">{treatments.map((_, index) => <button key={index} onClick={() => { setAuto(false); setActive(index); }} className={`w-2 h-2 rounded-full transition-all ${index === active ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />)}</div></div></div></section>;
}

function AssessmentTeaser({ onOpen }) {
  return <section id="consultation" className="py-10 lg:py-14 bg-muted/40"><div className="container"><div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">Online Skin <span className="italic text-primary">Assessment</span></h2><p className="text-muted-foreground font-body mb-8 leading-relaxed max-w-md">Tell us what's bothering you about your skin. Sonia reads every submission herself and replies with the treatments she'd genuinely recommend — no charge, no pressure to book.</p><Button onClick={onOpen} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6">Start your assessment <ArrowRight className="w-4 h-4 ml-2" /></Button></motion.div>
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-first lg:order-last"><div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"><img src="/assets/skin-assessment.jpg" alt="A skin consultation at Skin Nourishers" className="w-full h-full object-cover" /></div></motion.div>
  </div></div></section>;
}

function AssessmentModal({ open, onClose }) {
  const initial = { fullName: '', email: '', phone: '', skinConcern: '', treatmentInterest: '', additionalInfo: '' };
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submitEmail = async () => {
    setError('');
    if (!form.fullName || !form.email || !form.phone || !form.skinConcern || !form.treatmentInterest) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await sendInquiry({
        formName: 'Online Skin Assessment',
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        fields: {
          'Primary Concern': form.skinConcern,
          'Treatment Interest': form.treatmentInterest,
          'Additional Details': form.additionalInfo,
        },
      });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Unable to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const close = () => { onClose(); setSent(false); setForm(initial); setError(''); };
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={close}>
    <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl my-8 bg-white rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 p-8 md:p-10" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-2xl text-foreground">Online Skin Assessment</h3>
        <button type="button" aria-label="Close" onClick={close} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
      </div>
      {sent ? (
        <div className="text-center py-12">
          <h4 className="font-heading text-2xl text-foreground mb-3">Thank You!</h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Your skin assessment request has been submitted. Our team will review your information and contact you within 24-48 hours.</p>
          <Button variant="outline" onClick={close}>Close</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="pb-6 border-b border-primary/10"><h4 className="font-heading text-xl text-foreground mb-4">Client Information</h4><div className="grid md:grid-cols-2 gap-4"><Field label="Full Name *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} placeholder="Your full name" /><Field label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="e.g. 083 xxx xxxx" /></div><div className="mt-4"><Field label="Email Address *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="your@email.com" /></div></div>
          <div className="space-y-4"><h4 className="font-heading text-xl text-foreground">Skin Assessment</h4><div className="grid md:grid-cols-2 gap-4"><SelectField label="Primary Skin Concern *" value={form.skinConcern} onChange={(v) => setForm({ ...form, skinConcern: v })} options={skinConcerns} placeholder="Select your concern" /><SelectField label="Treatment of Interest *" value={form.treatmentInterest} onChange={(v) => setForm({ ...form, treatmentInterest: v })} options={treatmentOptions} placeholder="Select a treatment" /></div><label className="space-y-2 block"><span className="text-sm font-medium">Additional Information (Optional)</span><textarea rows={4} value={form.additionalInfo} onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} placeholder="Tell us more about your skin history, current routine, or any specific concerns..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></label></div>
          <div className="pt-6 border-t border-primary/10">{error && <p className="text-sm text-destructive text-center mb-4" role="alert">{error}</p>}<Button onClick={submitEmail} disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 disabled:pointer-events-none disabled:opacity-50">{submitting ? 'Sending...' : 'Send Assessment'}</Button></div>
        </div>
      )}
    </motion.div>
  </div>;
}
function Field({ label, value, onChange, placeholder, type = 'text' }) { return <label className="space-y-2 block"><span className="text-sm font-medium">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></label>; }
function SelectField({ label, value, onChange, options, placeholder }) { return <label className="space-y-2 block"><span className="text-sm font-medium">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>; }

function FounderSection() {
  const features = [{ title: 'Passion for Results', description: "Every client's transformation is personal to us" }, { title: 'Client-Centered Care', description: 'Your unique skin journey guides everything we do' }, { title: 'Continuous Innovation', description: 'Always learning and bringing you the latest in skincare' }];
  return <section className="py-12 lg:py-16 bg-secondary/40"><div className="container"><div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative"><div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"><img src="/assets/about-image-BmoL2o4f.png" alt="Sonia - Founder of Skin Nourishers" className="w-full h-full object-cover object-top" /><div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" /></div><div className="absolute -bottom-4 -left-4 lg:-left-8 bg-gradient-to-br from-primary to-rose px-6 py-4 rounded-2xl shadow-xl shadow-primary/30"><div className="text-center"><div className="font-heading text-3xl text-primary-foreground font-light">15+</div><div className="text-xs text-primary-foreground/80 uppercase tracking-elegant font-body">Years</div></div></div></motion.div><motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">A Journey of<br /><span className="italic text-primary">Passion & Purpose</span></h2><div className="w-16 h-px bg-primary/50 mb-8" /><p className="text-muted-foreground font-body leading-relaxed mb-6">Skin Nourishers was born from a deeply personal journey. After struggling with my own skin concerns for years and experiencing the frustration of ineffective treatments, I made it my mission to create a space where real results meet genuine care.</p><p className="text-muted-foreground font-body leading-relaxed mb-6">What began as a passion for helping others achieve healthy, radiant skin has grown into a trusted destination for clients across Sandton and beyond. Every treatment we offer reflects the same dedication I would give to my own skin—because I understand what it means to want real change.</p><p className="text-muted-foreground font-body leading-relaxed mb-10">At Skin Nourishers, we don't just treat skin—we build confidence. Our philosophy is simple: listen deeply, treat thoughtfully, and celebrate every transformation together with our clients.</p><div className="grid gap-5 mb-10">{features.map((item) => <div key={item.title} className="border-l-2 border-primary/30 pl-4"><h3 className="font-heading text-lg text-foreground mb-1">{item.title}</h3><p className="text-muted-foreground text-sm font-body">{item.description}</p></div>)}</div><Link to="/about" className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors duration-300 font-body text-sm uppercase tracking-wide-elegant group"><span>Read Our Full Story</span><ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" /></Link></motion.div></div></div></section>;
}

const comparisons = [{ treatment: 'Acne Treatment', duration: '8 Weeks', before: '/assets/acne-result-1-eKDwtebj.png', after: '/assets/acne-result-2-BKi4lopZ.png', description: 'Complete clearance of active acne with reduced scarring visibility.' }, { treatment: 'Pigmentation', duration: '12 Weeks', before: '/assets/pigmentation-result-1-C-Ovj2xV.png', after: '/assets/pigmentation-result-2-DUWasAE8.png', description: 'Significant reduction in hyperpigmentation for even skin tone.' }];
function BeforeAfter() {
  const [active, setActive] = useState(0); const [position, setPosition] = useState(50); const current = comparisons[active]; const ref = useRef(null);
  const move = (clientX) => { const rect = ref.current?.getBoundingClientRect(); if (!rect) return; setPosition(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))); };
  return <section className="py-12 lg:py-16 bg-background"><div className="container"><div className="text-center mb-10 flex flex-col items-center"><h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">Before & <span className="italic text-primary">After</span></h2><div className="w-16 h-px bg-primary/50 mx-auto" /></div><div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><div className="relative order-2 lg:order-1"><div ref={ref} className="relative aspect-[4/5] overflow-hidden cursor-ew-resize select-none rounded-lg shadow-elegant" onMouseMove={(e) => e.buttons === 1 && move(e.clientX)} onClick={(e) => move(e.clientX)} onTouchMove={(e) => move(e.touches[0].clientX)}><img src={current.before} alt="Before treatment" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img src={current.after} alt="After treatment" className="absolute inset-0 w-full h-full object-cover" /></div><div className="absolute top-0 bottom-0 w-px bg-white z-10" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-white bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"><div className="flex gap-0.5"><ArrowLeft className="w-3 h-3 text-white" /><ArrowRight className="w-3 h-3 text-white" /></div></div></div><div className="absolute bottom-6 left-6 px-3 py-1.5 bg-foreground/80 text-background text-xs font-body uppercase tracking-elegant backdrop-blur-sm rounded">Before</div><div className="absolute bottom-6 right-6 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-body uppercase tracking-elegant rounded">After</div></div><p className="text-center text-xs text-muted-foreground mt-4 font-body uppercase tracking-elegant">Drag to compare</p></div><div className="order-1 lg:order-2"><div className="mb-10"><div className="flex items-center gap-4 mb-6"><span className="text-xs font-body uppercase tracking-elegant text-primary">{current.treatment}</span><span className="w-8 h-px bg-primary/30" /><span className="text-xs font-body text-muted-foreground">{current.duration}</span></div><p className="font-heading text-2xl lg:text-3xl text-foreground font-light leading-relaxed mb-6">“{current.description}”</p></div><div className="flex items-center gap-4"><button onClick={() => { setActive((v) => (v - 1 + comparisons.length) % comparisons.length); setPosition(50); }} className="w-12 h-12 border border-primary/30 rounded-full flex items-center justify-center hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors text-foreground"><ArrowLeft className="h-4 w-4" /></button><div className="flex gap-3">{comparisons.map((_, index) => <button key={index} onClick={() => { setActive(index); setPosition(50); }} className={`w-2 h-2 rounded-full transition-all ${index === active ? 'bg-primary w-8' : 'bg-primary/30 hover:bg-primary/50'}`} />)}</div><button onClick={() => { setActive((v) => (v + 1) % comparisons.length); setPosition(50); }} className="w-12 h-12 border border-primary/30 rounded-full flex items-center justify-center hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors text-foreground"><ArrowRight className="h-4 w-4" /></button></div></div></div></div></section>;
}

function Reviews() {
  const [active, setActive] = useState(0); const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused) return; const timer = setInterval(() => setActive((v) => (v + 1) % reviews.length), 5000); return () => clearInterval(timer); }, [paused]);
  const review = reviews[active];
  return <section className="py-12 lg:py-16 bg-muted/40" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><div className="container"><div className="text-center mb-10 flex flex-col items-center"><h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">What Our Clients <span className="italic text-primary">Say</span></h2></div><div className="max-w-4xl mx-auto"><div className="relative min-h-[320px]"><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: .5 }} className="absolute inset-0 flex flex-col items-center text-center"><p className="font-heading text-xl md:text-2xl lg:text-3xl text-foreground font-light italic leading-relaxed mb-8 px-4">“{review.quote}”</p><div className="flex gap-1 mb-4">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}</div><div className="text-foreground font-body font-medium text-lg flex items-center justify-center gap-2">{review.name}{review.badge && <span className="text-xs text-muted-foreground font-normal">· {review.badge}</span>}</div></motion.div></AnimatePresence></div><div className="flex items-center justify-center gap-4 mt-8"><button onClick={() => setActive((v) => (v - 1 + reviews.length) % reviews.length)} className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-300 text-primary"><ChevronLeft className="w-5 h-5" /></button><div className="flex gap-2 overflow-hidden max-w-[200px]">{reviews.map((_, index) => <button key={index} onClick={() => setActive(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${active === index ? 'bg-primary w-6' : 'bg-primary/30 hover:bg-primary/50'}`} />)}</div><button onClick={() => setActive((v) => (v + 1) % reviews.length)} className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-300 text-primary"><ChevronRight className="w-5 h-5" /></button></div><div className="text-center mt-6 text-muted-foreground text-sm font-body">{active + 1} of {reviews.length} reviews</div></div></div></section>;
}

function FinalCTA() {
  const { openBooking } = useBooking();
  return <section className="relative py-12 lg:py-16 overflow-hidden"><div className="absolute inset-0"><img src="/assets/cta-bg-CSbw12-N.jpg" alt="Luxury spa environment" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-rose-light/90 to-white/95" /><div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" /></div><div className="container relative z-10"><div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><div><h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">Ready to Transform<br /><span className="italic text-primary">Your Skin?</span></h2><div className="w-20 h-1 bg-gradient-to-r from-primary to-rose/50 mb-8 rounded-full" /><p className="text-muted-foreground font-body leading-relaxed mb-10 max-w-lg text-lg">Book your consultation today and discover how our personalized treatments can help you achieve the radiant, healthy skin you deserve.</p><div className="flex flex-col sm:flex-row gap-4"><button type="button" onClick={() => openBooking({})} className="group inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-7 text-sm uppercase tracking-wide-elegant font-body font-semibold rounded-full shadow-xl shadow-primary/30">Book Now <ArrowRight className="ml-2 h-4 w-4" /></button><Link to="/pricing" className="inline-flex items-center justify-center border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-7 text-sm uppercase tracking-wide-elegant font-body font-semibold rounded-full bg-white/50 backdrop-blur-sm">View Pricing</Link></div></div><div className="lg:pl-12"><div className="border border-primary/20 p-8 lg:p-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-primary/10"><h3 className="font-heading text-2xl text-foreground mb-8 flex items-center gap-3"><span className="w-8 h-px bg-primary/50" />Get in Touch</h3><div className="space-y-6"><a href="tel:+27788210150" className="flex items-start gap-4 group"><div className="w-12 h-12 border border-primary/30 rounded-full flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-primary" /></div><div><div className="text-xs text-muted-foreground uppercase tracking-elegant font-body mb-1">Call Us</div><div className="text-foreground font-body group-hover:text-primary transition-colors">+27 78 821 0150</div></div></a><div className="flex items-start gap-4"><div className="w-12 h-12 border border-primary/30 rounded-full flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div><div><div className="text-xs text-muted-foreground uppercase tracking-elegant font-body mb-1">Visit Us</div><div className="text-foreground font-body">100 South Road, Morning View Shopping Centre, Sandton, 2191</div></div></div><div className="pt-6 border-t border-primary/10"><div className="text-xs text-muted-foreground uppercase tracking-elegant font-body mb-3">Opening Hours</div><div className="grid grid-cols-2 gap-2 text-sm font-body"><span className="text-muted-foreground">Tue - Fri</span><span className="text-foreground">09:00 - 18:00</span><span className="text-muted-foreground">Saturday</span><span className="text-foreground">09:00 - 15:00</span><span className="text-muted-foreground">Sun & Mon</span><span className="text-foreground">Closed</span></div></div></div></div></div></div></div></section>;
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
  return <AnimatePresence>{visible && <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: .3 }} className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border py-3 px-4 lg:hidden shadow-lg"><div className="flex gap-3"><button type="button" onClick={() => openBooking({})} className="flex-1 inline-flex items-center justify-center h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-body"><CalendarDays className="h-4 w-4 mr-2" />Book Now</button></div></motion.div>}</AnimatePresence>;
}

export default function Home() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  return <Layout><HomeHero onOpenAssessment={() => setAssessmentOpen(true)} /><TreatmentsCarousel /><AssessmentTeaser onOpen={() => setAssessmentOpen(true)} /><FounderSection /><BeforeAfter /><Reviews /><FinalCTA /><MobileStickyCTA /><AssessmentModal open={assessmentOpen} onClose={() => setAssessmentOpen(false)} /></Layout>;
}
