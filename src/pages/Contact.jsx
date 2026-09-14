import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import Layout from '../components/Layout';

const contact = [
  { icon: Phone, title: 'Phone', info: '+27 78 821 0150', link: 'tel:+27788210150' },
  { icon: Mail, title: 'Email', info: 'info@skinnourishers.co.za', link: 'mailto:info@skinnourishers.co.za' },
  { icon: MapPin, title: 'Address', info: '100 South Road, Morning View Shopping Centre, Sandton, 2191' },
  { icon: Clock3, title: 'Hours', info: 'Tue-Fri: 9AM-6PM, Sat: 9AM-4PM, Sun & Mon: Closed' },
];
export default function Contact() {
  return <Layout><section className="sec-mist" style={{ paddingTop: 'clamp(96px, 12vw, 152px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}><div className="container text-center"><span className="eyebrow mb-4" style={{ display: 'inline-block' }}>Contact</span><h1 className="d1 mb-4">Get In <em>Touch</em></h1><p className="lede text-lg" style={{ marginInline: 'auto' }}>We&rsquo;d love to hear from you. Reach out today.</p></div></section><section className="sec-porcelain sec-pad"><div className="container"><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">{contact.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: index * .1 }} viewport={{ once: true }} className="text-center h-full" style={{ border: '1px solid var(--line)', borderRadius: '2px', padding: 'var(--s6) var(--s5)' }}><div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(var(--muted))' }}><item.icon className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} /></div><h3 className="font-heading font-medium text-lg mb-2">{item.title}</h3>{item.link ? <a href={item.link} className="text-sm transition-colors" style={{ color: 'var(--fg-muted)' }}>{item.info}</a> : <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>{item.info}</p>}</motion.div>)}</div></div></section></Layout>;
}
