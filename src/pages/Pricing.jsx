import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import pricing from '../data/pricing.json';

export default function Pricing() {
  return (
    <Layout>
      <PageHero
        tagline="Pricing"
        title="Our Price"
        titleHighlight="List"
        subtitle="Transparent pricing for all our premium treatments"
        secondaryButtonText="View Services"
        secondaryButtonLink="/services"
        imageIndex={4}
      />

      <section className="py-16 lg:py-24">
        <div className="container space-y-16">
          {pricing.map((group) => (
            <section key={group.category}>
              <div className="text-center mb-8">
                <h2 className="font-heading text-3xl md:text-4xl font-light">
                  {group.category}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.services.map((service) => (
                  <article
                    key={`${group.category}-${service.name}`}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    {service.video && (
                      <div className="relative aspect-video overflow-hidden bg-secondary/30">
                        <video
                          src={service.video}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controlsList="nodownload"
                          disablePictureInPicture
                        />
                      </div>
                    )}
                    <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-heading text-xl font-semibold leading-snug group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <span className="text-primary font-bold text-xl whitespace-nowrap">
                        {service.price}
                      </span>
                    </div>
                    {service.duration && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                        <Clock className="h-4 w-4" /> {service.duration}
                      </p>
                    )}
                    <Link
                      to={`/booking?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.priceValue ?? 0)}&category=${encodeURIComponent(group.category)}&duration=${encodeURIComponent(service.duration || '')}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Book Now <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto p-8 bg-secondary/30 rounded-2xl">
            <p className="text-muted-foreground mb-6">
              All prices are subject to change. A consultation may be required before certain treatments.
            </p>
            <a
              href="https://skinnourishers.booksy.com/a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Book Your Treatment <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
