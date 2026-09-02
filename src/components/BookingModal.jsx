import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { X, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import catalog from '../data/services-catalog.json';
import { startPayfastCheckout } from '../lib/payfast';

const BookingContext = createContext(null);
export const useBooking = () => useContext(BookingContext);

const rand = (n) => 'R' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const firstVisitPrice = (n) => Math.round((n * 0.65) / 5) * 5;

export function BookingProvider({ children }) {
  const [seed, setSeed] = useState(null);
  const openBooking = useCallback((next = {}) => setSeed(next), []);
  const closeBooking = useCallback(() => setSeed(null), []);
  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      {seed && <BookingModal seed={seed} onClose={closeBooking} />}
    </BookingContext.Provider>
  );
}

function BookingModal({ seed, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', notes: '',
    category: seed.category || '',
    service: seed.service || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const categories = useMemo(() => catalog.map((c) => c.category), []);
  const group = useMemo(() => catalog.find((c) => c.category === form.category) || null, [form.category]);
  const services = group ? group.services : [];
  const selected = services.find((s) => s.name === form.service) || null;

  const price = selected ? selected.price : 0;
  const deposit = price > 0 ? Math.round(price * 0.5) : 0;
  const discounted = price > 0 ? firstVisitPrice(price) : 0;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setCategory = (value) => setForm((f) => ({ ...f, category: value, service: '' }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone) {
      setError('Please add your name, email and phone number.');
      return;
    }
    if (!form.category || !form.service || price <= 0) {
      setError('Please choose a treatment.');
      return;
    }
    setSubmitting(true);
    window.sessionStorage.setItem(
      'skin-nourishers-booking-draft',
      JSON.stringify({ ...form, price, deposit, duration: selected?.duration || '' }),
    );
    try {
      await startPayfastCheckout({
        type: 'booking',
        category: form.category,
        service: form.service,
        customer: { name: form.name, email: form.email, phone: form.phone },
      });
      // On success the browser is redirected to PayFast.
    } catch (err) {
      setSubmitting(false);
      setError(err.message || 'Unable to start payment. Please try again.');
    }
  };

  const title = seed.title || selected?.name || form.category || 'Book a treatment';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book a treatment"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl border border-border">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-card/95 backdrop-blur px-6 pt-6 pb-4 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-body">Book &amp; pay deposit</p>
            <h2 className="font-heading text-2xl font-light leading-tight">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-5">
          <div className="grid gap-3">
            <label className="space-y-1.5">
              <span className="text-sm font-medium">Category</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">Treatment</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                value={form.service}
                onChange={(e) => set('service', e.target.value)}
                disabled={!group}
              >
                <option value="">Select a treatment</option>
                {group && group.tiers
                  ? group.tiers.map((tier) => (
                      <optgroup key={tier} label={tier}>
                        {services.filter((s) => s.tier === tier).map((s) => (
                          <option key={s.name} value={s.name}>{s.name} — {rand(s.price)}</option>
                        ))}
                      </optgroup>
                    ))
                  : services.map((s) => (
                      <option key={s.name} value={s.name}>{s.name} — {rand(s.price)}</option>
                    ))}
              </select>
            </label>
          </div>

          {selected && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" />{selected.duration}</span>
                <span className="text-muted-foreground line-through">{rand(price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">First-visit price</span>
                <span className="font-semibold text-primary">{rand(discounted)} <span className="text-xs font-normal text-muted-foreground">(−35%)</span></span>
              </div>
              <div className="flex items-center justify-between border-t border-primary/15 pt-2">
                <span className="text-sm font-medium">Deposit to pay now (50%)</span>
                <span className="font-semibold">{rand(deposit)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Balance is paid at your appointment. 35% off applies to your first treatment only
                (first visit, one treatment) — mention “First Visit” on Booksy.
              </p>
            </div>
          )}

          <div className="grid gap-3">
            <input
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Full name *"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                type="tel"
                placeholder="Phone *"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                required
              />
            </div>
            <textarea
              className="min-h-[64px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Notes (allergies, skin concerns, preferred times…)"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
            />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !selected || !form.name || !form.email || !form.phone}
            className="inline-flex items-center justify-center h-11 w-full rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting
              ? 'Starting secure payment…'
              : <>{deposit > 0 ? `Pay deposit ${rand(deposit)}` : 'Pay deposit'}<ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>

          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            After payment you choose your date &amp; time on Booksy.
          </p>
        </form>
      </div>
    </div>
  );
}
