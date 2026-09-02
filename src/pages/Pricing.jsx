import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Search, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import catalog from '../data/services-catalog.json';

const FIRST_VISIT_RATE = 0.65; // 35% off first treatment

const rand = (n) => 'R' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const firstVisitPrice = (n) => Math.round((n * FIRST_VISIT_RATE) / 5) * 5;

function ServiceRow({ service, category, open, onToggle }) {
  const discounted = firstVisitPrice(service.price);
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-4 text-left hover:bg-muted/40 transition-colors px-2 -mx-2 rounded-lg"
        aria-expanded={open}
      >
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        <span className="flex-1 font-body text-foreground">{service.name}</span>
        <span className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-sm text-muted-foreground line-through">{rand(service.price)}</span>
          <span className="font-semibold text-primary">{rand(discounted)}</span>
          <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wide bg-accent/15 text-accent-foreground/90 rounded-full px-2 py-0.5">−35%</span>
        </span>
      </button>
      {open && (
        <div className="px-8 pb-5 pt-1 space-y-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {service.duration}
          </p>
          <p className="text-sm text-muted-foreground">
            Standard price <span className="text-foreground">{rand(service.price)}</span>.
            First-visit price <span className="text-foreground font-medium">{rand(discounted)}</span> —
            35% off applies to your first treatment only (first visit, one treatment, not combined with other offers).
          </p>
          <Link
            to={`/booking?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&category=${encodeURIComponent(category)}&duration=${encodeURIComponent(service.duration || '')}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Book this treatment <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState(null);

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    if (!q) return catalog;
    return catalog
      .map((group) => ({
        ...group,
        services: group.services.filter(
          (s) => s.name.toLowerCase().includes(q) || group.category.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.services.length > 0);
  }, [q]);

  const total = catalog.reduce((n, g) => n + g.services.length, 0);

  return (
    <Layout>
      <PageHero
        tagline="Pricing"
        title="Treatment"
        titleHighlight="Menu"
        subtitle={`Every treatment we offer — ${total} in total — with your first-visit price shown on each.`}
        secondaryButtonText="Treatment Details"
        secondaryButtonLink="/services"
        imageIndex={4}
      />

      <section className="py-12 lg:py-16">
        <div className="container max-w-4xl">
          <div className="mb-8 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4">
            <p className="font-body text-sm text-foreground">
              <span className="font-semibold">New client?</span> Your first treatment is <span className="font-semibold">35% off</span>.
              The price beside each treatment below is the first-visit price; the standard price is shown struck through.
              First visit, first treatment only.
            </p>
          </div>

          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treatments — e.g. brazilian, pigmentation, HIFU, laser"
              className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm font-body outline-none focus:border-primary/50"
            />
          </div>

          {groups.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No treatments match “{query}”.</p>
          )}

          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group.category}>
                <div className="flex items-baseline justify-between mb-2 border-b-2 border-primary/20 pb-2">
                  <h2 className="font-heading text-2xl md:text-3xl font-light">{group.category}</h2>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{group.services.length} treatments</span>
                </div>
                {(group.tiers || [null]).map((tier) => {
                  const rows = tier
                    ? group.services.filter((s) => s.tier === tier)
                    : group.services;
                  if (rows.length === 0) return null;
                  return (
                    <div key={tier || 'all'} className={tier ? 'mt-6 first:mt-3' : ''}>
                      {tier && (
                        <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 mt-4">
                          {tier}
                        </h3>
                      )}
                      {rows.map((service) => {
                        const key = `${group.category}::${service.name}`;
                        return (
                          <ServiceRow
                            key={key}
                            service={service}
                            category={group.category}
                            open={openKey === key}
                            onToggle={() => setOpenKey(openKey === key ? null : key)}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto p-8 bg-secondary/30 rounded-2xl">
            <p className="text-muted-foreground mb-6">
              Prices match our Booksy booking system and may change. A consultation is required before certain treatments.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Book Your Treatment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
