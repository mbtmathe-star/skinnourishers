import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, Mail, Phone, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui';

const BOOKSY_URL = 'https://booksy.com/en-za/182283_skin-nourishers_skin-care_10725_johannesburg';

export function PaymentSuccess() {
  const [params] = useSearchParams();
  const booking = params.get('type') === 'booking' || !params.get('type');
  useEffect(() => { window.localStorage.removeItem('cart'); }, []);

  if (!booking) {
    return <Layout><section className="py-24 lg:py-32"><div className="container max-w-lg text-center"><div className="mb-8"><CheckCircle2 className="h-24 w-24 text-green-500 mx-auto" /></div><h1 className="font-heading text-3xl md:text-4xl font-semibold mb-4">Payment Successful!</h1><p className="text-muted-foreground mb-8">Thank you for your purchase. Your order has been received and is being processed. You will receive a confirmation email shortly.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link to="/products" className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground">Continue Shopping</Link><Link to="/" className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md border border-input bg-background">Back to Home</Link></div></div></section></Layout>;
  }

  return (
    <Layout>
      <section className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <div className="mb-6 relative inline-block"><CheckCircle2 className="h-24 w-24 text-green-500 mx-auto" /><motion.div className="absolute inset-0 rounded-full bg-green-500/20" initial={{ scale: 1 }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} /></div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-4">Deposit Paid Successfully!</h1>
            <p className="text-muted-foreground text-lg mb-2">Thank you for securing your appointment with us.</p>
            <p className="text-muted-foreground">You’re almost done! Complete your booking on Booksy below.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-primary/30 bg-primary/5 mb-6"><CardContent className="py-8 text-center"><div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><CalendarDays className="h-8 w-8 text-primary" /></div><h2 className="font-heading text-2xl font-semibold mb-2">Step 2: Choose Your Date & Time</h2><p className="text-muted-foreground mb-4 max-w-md mx-auto">Click the button below to access Booksy and select your preferred appointment slot.</p><div className="bg-secondary/50 rounded-lg p-4 mb-6 max-w-md mx-auto text-left"><h4 className="font-semibold text-sm mb-2">📋 On Booksy, simply:</h4><ul className="text-sm text-muted-foreground space-y-1"><li>• Find the service you selected</li><li>• Choose your preferred date and time</li><li>• <strong className="text-foreground">No payment required</strong> – your deposit is already paid!</li><li>• The remaining balance is due at your appointment</li></ul></div><a href={BOOKSY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg bg-primary text-primary-foreground"><CalendarDays className="h-5 w-5 mr-2" />Select Your Time on Booksy<ArrowRight className="h-5 w-5 ml-2" /></a></CardContent></Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="mb-6"><CardContent className="py-6"><h3 className="font-heading font-semibold mb-4">Important Information</h3><ul className="space-y-3 text-sm text-muted-foreground">{['A confirmation email has been sent to your inbox','Your deposit is non-refundable but can be transferred to a different service','The remaining 50% is due at your appointment','Please arrive 10 minutes before your scheduled time'].map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{item}</span></li>)}</ul></CardContent></Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card><CardContent className="py-4"><p className="text-sm text-muted-foreground mb-3">Need to reschedule or have questions?</p><div className="flex flex-wrap gap-4 text-sm"><a href="tel:+27788210150" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4" />+27 78 821 0150</a><a href="mailto:info@skinnourishers.co.za" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4" />info@skinnourishers.co.za</a></div></CardContent></Card>
          </motion.div>
          <div className="text-center mt-8"><Link to="/" className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md hover:bg-accent">Back to Home</Link></div>
        </div>
      </section>
    </Layout>
  );
}

export function PaymentCancelled() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="container max-w-lg text-center">
          <div className="mb-8"><XCircle className="h-24 w-24 text-destructive mx-auto" /></div>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-4">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">Your payment was cancelled. Don’t worry - your cart items are still saved. You can try again whenever you’re ready.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center"><Link to="/products" className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground">Return to Products</Link><Link to="/" className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md border border-input bg-background">Back to Home</Link></div>
        </div>
      </section>
    </Layout>
  );
}
