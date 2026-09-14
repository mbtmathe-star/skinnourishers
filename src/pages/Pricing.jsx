import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Search, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import catalog from '../data/services-catalog.json';
import { useBooking } from '../components/BookingModal';

const rand = (n) => {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return "R" + grouped + (cents ? "," + String(cents).padStart(2, "0") : "");
};

function ServiceRow({ service, category, open, onToggle }) {
  const { openBooking } = useBooking();
  return (
    <div className="border-b" style={{ borderColor: 'var(--line)' }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-4 text-left transition-colors"
        aria-expanded={open}
      >
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--fg-muted)' }} />
        <span className="flex-1 font-body text-foreground">{service.name}</span>
        <span className="font-mono text-sm whitespace-nowrap">{rand(service.price)}</span>
      </button>
      {open && (
        <div className="pl-8 pb-5 pt-1 space-y-3">
          {service.desc && <p className="lede">{service.desc}</p>}
          <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-muted)' }}>
            <Clock className="h-4 w-4" /> {service.duration}
          </p>
          <button
            type="button"
            onClick={() => openBooking({ category, service: service.name, title: service.name })}
            className="card-book"
          >
            Book this treatment <ArrowRight className="h-4 w-4 ml-2" />
          </button>
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
          (s) =>
            s.name.toLowerCase().includes(q) ||
            group.category.toLowerCase().includes(q) ||
            (s.tier && s.tier.toLowerCase().includes(q)) ||
            (s.desc && s.desc.toLowerCase().includes(q)),
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
        subtitle={`Every treatment we offer — ${total} in total — at the same price you pay on Booksy.`}
        secondaryButtonText="Treatment Details"
        secondaryButtonLink="/services"
        imageIndex={4}
      />

      <section className="sec-porcelain sec-pad">
        <div className="container max-w-4xl">
          <span className="eyebrow">Full price list</span>
          <h2 className="d2 sec-h">Every treatment, one price.</h2>
          <p className="lede sec-p">The same {total} treatments and prices you would find on Booksy — search by name, concern or treatment depth.</p>

          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--fg-muted)' }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treatments — e.g. brazilian, pigmentation, HIFU, laser"
              className="w-full border bg-card pl-11 pr-4 py-3 text-sm font-body outline-none"
              style={{ borderColor: 'var(--line)', borderRadius: '2px' }}
            />
          </div>

          {groups.length === 0 && (
            <p className="text-center py-12" style={{ color: 'var(--fg-muted)' }}>No treatments match &ldquo;{query}&rdquo;.</p>
          )}

          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group.category}>
                <div className="flex items-baseline justify-between mb-2 pb-2 border-b" style={{ borderColor: 'var(--line-strong)' }}>
                  <h3 className="d3">{group.category}</h3>
                  <span className="eyebrow">{group.services.length} treatments</span>
                </div>
                {(group.tiers || [null]).map((tier) => {
                  const rows = tier
                    ? group.services.filter((s) => s.tier === tier)
                    : group.services;
                  if (rows.length === 0) return null;
                  return (
                    <div key={tier || 'all'} className={tier ? 'mt-6 first:mt-3' : ''}>
                      {tier && <h4 className="eyebrow mb-1 mt-4">{tier}</h4>}
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

      <section className="sec-ash sec-pad">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow">Ready when you are</span>
            <p className="lede mb-8" style={{ marginInline: 'auto' }}>
              Prices match our Booksy booking system and may change. A consultation is required before certain treatments.
            </p>
            <Link to="/booking" className="btn-ref">
              Book Your Treatment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
