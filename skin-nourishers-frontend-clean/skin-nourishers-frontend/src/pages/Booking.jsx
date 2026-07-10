import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CalendarDays, CheckCircle2, Clock, CreditCard,
  Info, Mail, Phone, UserRound
} from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { Card, CardContent, CardHeader } from '../components/ui';
import pricing from '../data/pricing.json';

function findService(name, category) {
  const group = pricing.find((item) => item.category === category);
  if (group) {
    const service = group.services.find((item) => item.name === name);
    if (service) return { ...service, category: group.category };
  }
  for (const item of pricing) {
    const service = item.services.find((entry) => entry.name === name);
    if (service) return { ...service, category: item.category };
  }
  return null;
}

const steps = [
  { icon: UserRound, step: '1', title: 'Select Your Treatment', desc: 'Choose the service you want from our comprehensive menu and fill in your contact details.' },
  { icon: CreditCard, step: '2', title: 'Pay 50% Deposit', desc: 'Secure your booking with a 50% deposit via PayFast. The remaining balance is paid at your appointment.' },
  { icon: CalendarDays, step: '3', title: 'Choose Your Slot on Booksy', desc: 'After payment, you’ll be redirected to Booksy. Simply select your preferred date and time – no payment needed there, it’s already covered!' },
];

export default function Booking() {
  const [params] = useSearchParams();
  const serviceName = params.get('service') || '';
  const categoryName = params.get('category') || '';
  const recovered = serviceName ? findService(serviceName, categoryName) : null;
  const rawPrice = Number.parseFloat(params.get('price') || '0');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    category: categoryName || recovered?.category || '',
    service: serviceName,
    price: recovered?.priceValue || rawPrice || 0,
    duration: recovered?.duration || params.get('duration') || '',
    notes: '',
  });

  const services = useMemo(() => pricing.find((item) => item.category === form.category)?.services || [], [form.category]);
  const categories = useMemo(() => pricing.map((item) => item.category), []);
  const deposit = form.price > 0 ? Math.round(form.price * 0.5) : 0;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const changeCategory = (category) => setForm((current) => ({ ...current, category, service: '', price: 0, duration: '' }));
  const changeService = (name) => {
    const service = services.find((item) => item.name === name);
    if (service) setForm((current) => ({ ...current, service: name, price: service.priceValue, duration: service.duration }));
  };

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.service) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.price <= 0) {
      setError('Please select a valid service');
      return;
    }
    setSubmitting(true);
    // The captured frontend is complete, but payment processing depends on the old
    // Supabase/PayFast backend. Keep the draft without pretending a payment happened.
    window.sessionStorage.setItem('skin-nourishers-booking-draft', JSON.stringify({ ...form, deposit }));
    window.setTimeout(() => {
      setSubmitting(false);
      setError('Deposit payment will be connected during the backend restoration phase.');
    }, 350);
  };

  return (
    <Layout>
      <PageHero
        tagline="Secure Your Appointment"
        title="Book Your"
        titleHighlight="Treatment"
        subtitle="Pay a 50% deposit to unlock our booking system"
        secondaryButtonText="View Pricing"
        secondaryButtonLink="/pricing"
        imageIndex={5}
      />

      <section className="py-6 bg-primary/10 border-y border-primary/20">
        <div className="container">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <Info className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">How Our Booking Process Works</h3>
              <p className="text-muted-foreground">
                To secure your appointment, we require a <strong className="text-primary">50% deposit payment</strong> upfront. After your payment is confirmed, you’ll receive a link to our <strong>Booksy scheduling system</strong> where you can choose your preferred date and time. This ensures we can dedicate our full attention to your treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light mb-4">Simple <span className="text-primary italic">3-Step</span> Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We’ve made booking easy and secure. Here’s what to expect:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative">
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                      <step.icon className="h-7 w-7 text-primary" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{step.step}</div>
                    </div>
                    <h3 className="font-heading text-xl font-medium mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
                {index < 2 && <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"><ArrowRight className="h-6 w-6 text-primary/40" /></div>}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 max-w-3xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-heading font-semibold text-lg mb-1">First-Time Customer?</h4>
                    <p className="text-muted-foreground text-sm">Welcome! As a new client, you’ll enjoy <strong className="text-primary">20% off</strong> your first treatment. Simply select your service below, pay the deposit, and mention “First Visit” when booking on Booksy. We can’t wait to meet you!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={submit} className="space-y-8">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2"><UserRound className="h-5 w-5 text-primary" />Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Please provide your contact details</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="space-y-2"><span className="text-sm font-medium">Full Name *</span><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your full name" value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
                      <label className="space-y-2"><span className="text-sm font-medium">Phone Number *</span><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" type="tel" placeholder="+27 XX XXX XXXX" value={form.phone} onChange={(e) => update('phone', e.target.value)} required /></label>
                    </div>
                    <label className="space-y-2 block"><span className="text-sm font-medium">Email Address *</span><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} required /></label>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />Service Selection</h3>
                    <p className="text-sm text-muted-foreground">Choose the treatment you’d like to book</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="space-y-2"><span className="text-sm font-medium">Category *</span><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => changeCategory(e.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                      <label className="space-y-2"><span className="text-sm font-medium">Service *</span><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.service} onChange={(e) => changeService(e.target.value)} disabled={!form.category}><option value="">Select service</option>{services.map((service) => <option key={service.name} value={service.name}>{service.name} - R{service.priceValue}</option>)}</select></label>
                    </div>
                    {form.service && <div className="p-4 bg-primary/5 rounded-lg border border-primary/20"><div className="flex justify-between items-center"><div><p className="font-medium">{form.service}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {form.duration}</p></div><div className="text-right"><p className="text-lg font-bold text-primary">R{form.price}</p><p className="text-xs text-muted-foreground">50% deposit: R{deposit}</p></div></div></div>}
                    <label className="space-y-2 block"><span className="text-sm font-medium">Additional Notes (Optional)</span><textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Any skin concerns, allergies, or special requests..." value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} /></label>
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2 border-muted-foreground/30 bg-muted/30">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4"><CalendarDays className="h-6 w-6 text-muted-foreground flex-shrink-0" /><div><h4 className="font-medium mb-1">What happens next?</h4><p className="text-sm text-muted-foreground">After paying your deposit, you’ll be redirected to our Booksy page where you can select your preferred appointment date and time. Don’t worry – we have flexible scheduling!</p></div></div>
                  </CardContent>
                </Card>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-secondary/30">
                  <CardHeader><h3 className="text-2xl font-semibold leading-none tracking-tight">Booking Summary</h3></CardHeader>
                  <CardContent className="space-y-4">
                    {form.service ? <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="font-medium text-right">{form.service}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span>{form.duration}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Price</span><span>R{form.price}</span></div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-semibold text-lg"><span>Deposit (50%)</span><span className="text-primary">R{deposit}</span></div>
                        <p className="text-xs text-muted-foreground mt-1">Remaining R{form.price - deposit} due at appointment</p>
                      </div>
                      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                      <button type="button" onClick={submit} disabled={submitting || !form.service || !form.name || !form.email || !form.phone} className="inline-flex items-center justify-center h-11 px-8 w-full rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:pointer-events-none disabled:opacity-50">
                        {submitting ? 'Processing...' : <>Pay Deposit R{deposit}<ArrowRight className="ml-2 h-4 w-4" /></>}
                      </button>
                      <p className="text-xs text-center text-muted-foreground">You’ll choose your appointment time on Booksy after payment</p>
                    </> : <p className="text-muted-foreground text-center py-4">Select a service to see pricing</p>}
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">Need help with your booking?</p>
                    <div className="space-y-2 text-sm">
                      <a href="tel:+27788210150" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4" />+27 78 821 0150</a>
                      <a href="mailto:info@skinnourishers.co.za" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4" />info@skinnourishers.co.za</a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
