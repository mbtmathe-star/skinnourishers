import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Layout, { useWhatsAppTopic } from '../components/Layout';
import PageHero from '../components/PageHero';
import treatments from '../data/treatments.json';
import { useBooking } from '../components/BookingModal';
import { useInquiry } from '../components/InquiryModal';

const rand = (n) => {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return "R" + grouped + (cents ? "," + String(cents).padStart(2, "0") : "");
};

function bookingOptions(treatment) {
  return (treatment.pricing || [])
    .filter((p) => typeof p.price === 'number')
    .map((p) => ({ name: p.area, price: p.price, duration: treatment.duration }));
}

function CategoryNav({ active, onChange }) {
  return <div className="relative"><div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" /><div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" /><div className="overflow-x-auto scrollbar-hide py-2 -mx-4 px-4"><div className="flex gap-2 min-w-max">{treatments.map((item) => { const selected = active === item.id; return <button key={item.id} onClick={() => onChange(item.id)} className="relative px-5 py-2.5 text-sm font-medium uppercase tracking-wide whitespace-nowrap transition-colors" style={{ borderRadius: 'var(--radius)', fontSize: '13px', background: selected ? 'hsl(var(--primary))' : 'transparent', color: selected ? 'hsl(var(--primary-foreground))' : 'var(--fg-muted)' }}>{item.category}</button>; })}</div></div></div>;
}

function TreatmentDetail({ treatment }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { openBooking } = useBooking();
  const { openInquiry } = useInquiry();
  useWhatsAppTopic(treatment.category);
  const bookThis = () => openBooking({
    category: treatment.category,
    title: treatment.category,
    options: bookingOptions(treatment),
  });
  const askThis = () => openInquiry({ treatment: treatment.category });
  const hasPackages = treatment.pricing.some((p) => p.package);

  return <motion.div id={treatment.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} viewport={{ once: true }} className="scroll-mt-32">
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 mb-16">
      <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden group" style={{ borderRadius: 'calc(var(--radius) + 16px)', boxShadow: 'var(--shadow-lg)' }}>
        {treatment.video ? <video src={treatment.video} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline controlsList="nodownload" disablePictureInPicture poster={treatment.image} /> : <img src={treatment.image} alt={treatment.category} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex gap-3"><div className="bg-black/60 backdrop-blur-sm px-4 py-2" style={{ borderRadius: 'calc(var(--radius) + 4px)' }}><span className="text-sm text-white">{treatment.duration}</span></div><div className="bg-black/60 backdrop-blur-sm px-4 py-2" style={{ borderRadius: 'calc(var(--radius) + 4px)' }}><span className="text-sm text-white">{treatment.sessionsRecommended}</span></div></div>
      </div>
      <div className="flex flex-col justify-center">
        <span className="eyebrow mb-3">In detail</span>
        <h2 className="d2 mb-3">{treatment.category}</h2>
        <p className="text-lg text-foreground font-medium mb-3">{treatment.tagline}</p>
        <p className="lede mb-4">{treatment.description}</p>
        <div className="space-y-2 mb-5"><p className="lede italic">{treatment.problem}</p><p className="text-foreground">{treatment.solution}</p></div>
        <div className="flex flex-wrap gap-3"><button type="button" onClick={bookThis} className="btn-ref">Book Now <ArrowRight className="ml-2 h-5 w-5" /></button><button type="button" onClick={askThis} className="card-book">Ask Sonia about this treatment</button></div>
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-10 mb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="eyebrow mb-2">Process</span>
        <h3 className="d3 mb-5">How it works</h3>
        <div className="space-y-0">{treatment.howItWorks.map((step) => <div key={step.step} className="flex gap-4 py-3 border-b" style={{ borderColor: 'var(--line)' }}><span className="font-semibold text-xs shrink-0 mt-0.5" style={{ color: 'var(--fg-muted)' }}>{String(step.step).padStart(2, '0')}</span><div><h4 className="font-heading font-medium text-foreground mb-1">{step.title}</h4><p className="text-sm lede">{step.description}</p></div></div>)}</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="eyebrow mb-2">Why it works</span>
        <h3 className="d3 mb-5">Key benefits</h3>
        <div className="space-y-0">{treatment.benefits.map((benefit) => <div key={benefit} className="flex items-start gap-3 py-2.5 border-b" style={{ borderColor: 'var(--line)' }}><span className="mt-2 h-1 w-1 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--primary))' }} /><span className="text-sm text-foreground">{benefit}</span></div>)}</div>
      </motion.div>
    </div>

    <div className="grid lg:grid-cols-2 gap-10 mb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="eyebrow mb-2">Pricing</span>
        <h3 className="d3 mb-5">By area</h3>
        <div style={{ border: '1px solid var(--line)', borderRadius: 'calc(var(--radius) + 16px)' }} className="overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr style={{ background: 'hsl(var(--muted))' }}><th className="text-left p-3 eyebrow" style={{ display: 'table-cell' }}>Area</th><th className="text-right p-3 eyebrow" style={{ display: 'table-cell' }}>Price</th>{hasPackages && <th className="text-right p-3 eyebrow" style={{ display: 'table-cell' }}>Package</th>}</tr></thead>
            <tbody>{treatment.pricing.map((price, index) => <tr key={`${price.area}-${index}`} className="border-t" style={{ borderColor: 'var(--line)' }}><td className="p-3 text-foreground">{price.area}</td><td className="p-3 text-right font-semibold whitespace-nowrap">{typeof price.price === 'number' ? rand(price.price) : price.singleSession}</td>{hasPackages && <td className="p-3 text-right">{price.package && <span className="font-medium text-foreground">{price.package}</span>}</td>}</tr>)}</tbody>
          </table>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="sec-ink h-full flex flex-col justify-center p-8" style={{ borderRadius: 'calc(var(--radius) + 16px)', boxShadow: 'var(--shadow-md)' }}>
          <span className="eyebrow mb-2">Book</span>
          <h3 className="d3 mb-2">{treatment.category}</h3>
          <p className="lede mb-5">Choose your area and pay the deposit here — no redirect.</p>
          <button type="button" onClick={bookThis} className="btn-ref self-start">Book {treatment.category} <ArrowRight className="ml-2 h-4 w-4" /></button>
        </div>
      </motion.div>
    </div>

    {treatment.videoEmbed && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16"><span className="eyebrow mb-2 text-center block">Watch</span><h3 className="d3 mb-6 text-center">Treatment video</h3><div className="max-w-4xl mx-auto overflow-hidden" style={{ border: '1px solid var(--line)', borderRadius: 'calc(var(--radius) + 16px)', boxShadow: 'var(--shadow-lg)' }}><div className="relative w-full" style={{ paddingTop: '56.25%' }} dangerouslySetInnerHTML={{ __html: treatment.videoEmbed }} /></div></motion.div>}

    {treatment.beforeAfterImages?.length > 0 && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16"><span className="eyebrow mb-2 text-center block">Real results</span><h3 className="d3 mb-6 text-center">Before &amp; after</h3><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{treatment.beforeAfterImages.map((item) => <figure key={`${item.image}-${item.caption}`} className="overflow-hidden" style={{ border: '1px solid var(--line)', borderRadius: 'calc(var(--radius) + 8px)' }}><img src={item.image} alt={item.caption} className="w-full aspect-square object-cover" /><figcaption className="p-3 text-sm lede">{item.caption}</figcaption></figure>)}</div></motion.div>}

    {treatment.safetyInfo && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16"><div className="sec-mist p-5" style={{ borderRadius: 'calc(var(--radius) + 16px)' }}><h4 className="font-heading font-medium text-foreground mb-1">Safety &amp; care information</h4><p className="text-sm lede">{treatment.safetyInfo}</p></div></motion.div>}

    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><span className="eyebrow mb-2 text-center block">Questions</span><h3 className="d3 mb-6 text-center">Frequently asked</h3><div style={{ border: '1px solid var(--line)', borderRadius: 'calc(var(--radius) + 16px)' }}>{treatment.faqs.map((faq, index) => <div key={faq.question} className="border-b last:border-b-0" style={{ borderColor: 'var(--line)' }}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-6 py-4 text-left flex items-center justify-between"><span className="font-medium text-foreground pr-4">{faq.question}</span><ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} style={{ color: 'var(--fg-muted)' }} /></button>{openFaq === index && <div className="px-6 pb-4"><p className="lede">{faq.answer}</p></div>}</div>)}</div></motion.div>
  </motion.div>;
}

export default function Services() {
  const [active, setActive] = useState(treatments[0].id);
  const selectTab = (id) => {
    setActive(id);
    if (window.history.replaceState) window.history.replaceState(null, '', `#${id}`);
  };
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (fromHash && treatments.some((t) => t.id === fromHash)) setActive(fromHash);
  }, []);
  const current = treatments.find((t) => t.id === active) || treatments[0];
  return <Layout><PageHero tagline="What we do" title="Premium Skin Clinic in" titleHighlight="Sandton" subtitle="Science-backed, non-invasive treatments tailored to your unique skin concerns." secondaryButtonText="View Pricing" secondaryButtonLink="/pricing" imageIndex={2} /><section className="sticky top-16 z-40 bg-background/95 backdrop-blur-lg border-b py-4" style={{ borderColor: 'var(--line)' }}><div className="container"><CategoryNav active={active} onChange={selectTab} /></div></section><section className="sec-porcelain sec-pad"><div className="container"><TreatmentDetail key={current.id} treatment={current} /></div></section><section className="sec-ash sec-pad"><div className="container text-center"><span className="eyebrow">Ready when you are</span><h2 className="d2 sec-h">Ready to transform your skin?</h2><p className="lede sec-p" style={{ marginInline: 'auto' }}>Book a consultation with our skin specialists and get a personalized treatment plan.</p><Link to="/booking" className="btn-ref">Book Online Now <ArrowRight className="ml-2 h-5 w-5" /></Link></div></section></Layout>;
}
