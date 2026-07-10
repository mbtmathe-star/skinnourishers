import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Tag, UserRound } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { Card, CardContent } from '../components/ui';
import posts from '../data/blog.json';

export default function Blog() {
  return <Layout><PageHero tagline="Latest News" title="Our" titleHighlight="Blog" subtitle="Expert skincare tips, treatment insights, and wellness advice" secondaryButtonText="View Services" secondaryButtonLink="/services" /><section className="py-16 lg:py-24"><div className="container"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{posts.map((post, index) => <motion.div key={post.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: index * .1 }} viewport={{ once: true }}><Card className="group overflow-hidden hover:shadow-elegant transition-all h-full"><a href={post.link} target="_blank" rel="noreferrer"><div className="aspect-video overflow-hidden"><img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div></a><CardContent className="p-6"><div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3"><span className="flex items-center gap-1"><UserRound className="h-3 w-3" /> {post.author}</span><span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {post.date}</span><span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {post.category}</span></div><h3 className="font-heading text-lg font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3><p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p><a href={post.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center h-9 rounded-full px-3 bg-primary text-primary-foreground text-sm font-medium">Read More <ArrowRight className="ml-2 h-4 w-4" /></a></CardContent></Card></motion.div>)}</div></div></section></Layout>;
}
