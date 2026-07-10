import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui';

const contact = [
  { icon: Phone, title: 'Phone', info: '+27 78 821 0150', link: 'tel:+27788210150' },
  { icon: Mail, title: 'Email', info: 'info@skinnourishers.co.za', link: 'mailto:info@skinnourishers.co.za' },
  { icon: MapPin, title: 'Address', info: '100 South Road, Morning View Shopping Centre, Sandton, 2191' },
  { icon: Clock3, title: 'Hours', info: 'Tue-Fri: 9AM-6PM, Sat: 9AM-4PM' },
];
export default function Contact() {
  return <Layout><section className="pt-32 pb-12 bg-gradient-to-b from-secondary/50 to-transparent"><div className="container text-center"><span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Contact</span><h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light mb-4">Get In <span className="text-primary italic">Touch</span></h1><p className="text-muted-foreground text-lg max-w-xl mx-auto">We'd love to hear from you. Reach out today.</p></div></section><section className="py-16 lg:py-24"><div className="container"><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">{contact.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: index * .1 }} viewport={{ once: true }}><Card className="text-center hover:shadow-elegant transition-all h-full"><CardContent className="p-6"><div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><item.icon className="h-6 w-6 text-primary" /></div><h3 className="font-heading text-lg font-medium mb-2">{item.title}</h3>{item.link ? <a href={item.link} className="text-muted-foreground text-sm hover:text-primary transition-colors">{item.info}</a> : <p className="text-muted-foreground text-sm">{item.info}</p>}</CardContent></Card></motion.div>)}</div></div></section></Layout>;
}
