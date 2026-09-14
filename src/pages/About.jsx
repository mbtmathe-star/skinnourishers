import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';

export default function About() {
  return <Layout><PageHero tagline="About Us" title="Who We" titleHighlight="Are" subtitle="Established in 2019 with 25+ years of industry expertise" secondaryButtonText="Our Services" secondaryButtonLink="/services" imageIndex={3} /><section className="sec-porcelain sec-pad"><div className="container"><div className="grid lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: .6 }} viewport={{ once: true }}><img src="/assets/about-image-BmoL2o4f.png" alt="Skin Nourishers" className="w-full max-w-lg mx-auto" style={{ borderRadius: 'calc(var(--radius) + 16px)', boxShadow: 'var(--shadow-lg)' }} /></motion.div><motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .1 }} viewport={{ once: true }}><span className="eyebrow mb-3">Our story</span><h2 className="d2 mb-6">Confidence in clear skin</h2><p className="lede mb-6">Established in 2019 by Sonia, who has been in the industry for over 25 years, Sonia holds a number of accolades for being the top therapist.</p><p className="lede mb-8">Skin Nourishers was birthed to fill in the gaps in the industry, especially with targeting treatments such as pigmentation and acne. We&rsquo;ve joined hands with an esthetician doctor for more focused treatments and aim to provide outstanding, effective treatments.</p><Link to="/services" className="btn-ref">View Our Services <ArrowRight className="ml-2 h-5 w-5" /></Link></motion.div></div></div></section></Layout>;
}
