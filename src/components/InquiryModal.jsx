import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui';
import skinConcerns from '../data/skin-concerns.json';
import treatmentOptions from '../data/treatment-options.json';
import { sendInquiry } from '../lib/inquiry';

const InquiryContext = createContext(null);
export const useInquiry = () => useContext(InquiryContext);

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-medium">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

const BLANK = { fullName: '', email: '', phone: '', skinConcern: '', treatmentInterest: '', additionalInfo: '' };

export function InquiryProvider({ children }) {
  const [seed, setSeed] = useState(null);
  const openInquiry = useCallback((next = {}) => setSeed(next), []);
  const closeInquiry = useCallback(() => setSeed(null), []);
  return (
    <InquiryContext.Provider value={{ openInquiry, closeInquiry }}>
      {children}
      {seed && <InquiryModal seed={seed} onClose={closeInquiry} />}
    </InquiryContext.Provider>
  );
}

function InquiryModal({ seed, onClose }) {
  // If the visitor came from a treatment page, pre-fill the treatment they were
  // reading about so the enquiry "arrives already saying pigmentation" (Section 09).
  const referringTreatment = seed.treatment || '';
  // Show (and pre-select) the treatment the visitor came from, adding it to the
  // list if it isn't already one of the standard options.
  const interestOptions = referringTreatment && !treatmentOptions.includes(referringTreatment)
    ? [referringTreatment, ...treatmentOptions]
    : treatmentOptions;
  const [form, setForm] = useState({ ...BLANK, treatmentInterest: referringTreatment || '' });
  const [sent, setSent] = useState(false);
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

  const submit = async () => {
    setError('');
    if (!form.fullName || !form.email || !form.phone || !form.skinConcern || !form.treatmentInterest) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await sendInquiry({
        formName: 'Online Skin Assessment',
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        fields: {
          ...(referringTreatment ? { 'Enquiring About': referringTreatment } : {}),
          'Primary Concern': form.skinConcern,
          'Treatment Interest': form.treatmentInterest,
          'Additional Details': form.additionalInfo,
        },
      });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Unable to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl my-8 bg-white rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 p-8 md:p-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-2xl text-foreground">
            {referringTreatment ? `Ask about ${referringTreatment}` : 'Online Skin Assessment'}
          </h3>
          <button type="button" aria-label="Close" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        {sent ? (
          <div className="text-center py-12">
            <h4 className="font-heading text-2xl text-foreground mb-3">Thank You!</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Your enquiry has been submitted and recorded. Sonia will review your information and contact you within 24-48 hours.</p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {referringTreatment && (
              <p className="text-sm text-muted-foreground bg-secondary/40 rounded-lg px-4 py-3">
                This enquiry will be sent through as being about <span className="font-medium text-foreground">{referringTreatment}</span>.
              </p>
            )}
            <div className="pb-6 border-b border-primary/10">
              <h4 className="font-heading text-xl text-foreground mb-4">Client Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} placeholder="Your full name" />
                <Field label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="e.g. 083 xxx xxxx" />
              </div>
              <div className="mt-4"><Field label="Email Address *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="your@email.com" /></div>
            </div>
            <div className="space-y-4">
              <h4 className="font-heading text-xl text-foreground">Skin Assessment</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <SelectField label="Primary Skin Concern *" value={form.skinConcern} onChange={(v) => setForm({ ...form, skinConcern: v })} options={skinConcerns} placeholder="Select your concern" />
                <SelectField label="Treatment of Interest *" value={form.treatmentInterest} onChange={(v) => setForm({ ...form, treatmentInterest: v })} options={interestOptions} placeholder="Select a treatment" />
              </div>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Additional Information (Optional)</span>
                <textarea rows={4} value={form.additionalInfo} onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} placeholder="Tell us more about your skin history, current routine, or any specific concerns..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="pt-6 border-t border-primary/10">
              {error && <p className="text-sm text-destructive text-center mb-4" role="alert">{error}</p>}
              <Button onClick={submit} disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm py-6 disabled:pointer-events-none disabled:opacity-50">{submitting ? 'Sending...' : 'Send Assessment'}</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
