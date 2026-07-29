import React, { useEffect, useMemo, useState } from 'react';
import { Plus, ShoppingBag, X } from 'lucide-react';
import Layout from '../components/Layout';
import products from '../data/products.json';
import { startPayfastCheckout } from '../lib/payfast';
import { sendInquiry } from '../lib/inquiry';

function readCart() {
  try {
    const stored = JSON.parse(window.localStorage.getItem('cart'));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [consultError, setConsultError] = useState('');
  const [consultSent, setConsultSent] = useState(false);
  const [consultForm, setConsultForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...current, { id: product.id, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));

  const cartLines = useMemo(
    () => cart
      .map((item) => ({ ...item, product: products.find((p) => p.id === item.id) }))
      .filter((line) => line.product),
    [cart]
  );
  const cartCount = cartLines.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = cartLines.reduce((sum, line) => sum + line.product.priceValue * line.qty, 0);

  const submitCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError('');
    if (!customer.name || !customer.email || !customer.phone) {
      setCheckoutError('Please fill in all fields');
      return;
    }
    setCheckingOut(true);
    try {
      await startPayfastCheckout({
        type: 'shop',
        items: cart.map(({ id, qty }) => ({ id, qty })),
        customer,
      });
    } catch (err) {
      setCheckingOut(false);
      setCheckoutError(err.message || 'Unable to start checkout. Please try again.');
    }
  };

  const submitConsultation = async (event) => {
    event.preventDefault();
    setConsultError('');
    if (!consultForm.name || !consultForm.email || !consultForm.phone) {
      setConsultError('Please fill in all fields');
      return;
    }
    setConsultSubmitting(true);
    try {
      await sendInquiry({
        formName: 'Free Skin Consultation Request',
        name: consultForm.name,
        email: consultForm.email,
        phone: consultForm.phone,
        fields: {},
      });
      setConsultSent(true);
    } catch (err) {
      setConsultError(err.message || 'Unable to send. Please try again.');
    } finally {
      setConsultSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-to-b from-secondary/50 to-transparent">
        <div className="container text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Shop</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Our <span className="text-primary italic">Products</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Premium skincare solutions crafted for visible results
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex justify-between items-center mb-8 relative">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `Showing all ${products.length} results`}
            </p>
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen((open) => !open)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative overflow-hidden rounded-2xl bg-card shadow-elegant hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-secondary/30">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                        className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</span>
                      <h3 className="font-heading text-lg font-medium mt-1 mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-base font-semibold text-foreground">{product.price}</p>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 p-8 bg-secondary/30 rounded-2xl">
            <p className="text-lg text-foreground mb-2">Looking for personalized recommendations?</p>
            <p className="text-muted-foreground mb-4">Visit our clinic for a free skin consultation.</p>
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setCartOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card shadow-elegant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-medium">Your Cart</h3>
              <button type="button" aria-label="Close" onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {cartLines.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cartLines.map((line) => (
                    <div key={line.id} className="flex items-center justify-between gap-2 text-sm">
                      <div>
                        <p className="font-medium">{line.product.name}</p>
                        <p className="text-muted-foreground">{line.qty} x {line.product.price}</p>
                      </div>
                      <button type="button" aria-label={`Remove ${line.product.name}`} onClick={() => removeFromCart(line.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R{cartTotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  className="mt-4 inline-flex items-center justify-center h-11 w-full rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  Checkout with PayFast
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setCheckoutOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card shadow-elegant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-medium">Checkout Details</h3>
              <button type="button" aria-label="Close" onClick={() => setCheckoutOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submitCheckout} className="space-y-4">
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Full Name *</span>
                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} required />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Email Address *</span>
                <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))} required />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Phone Number *</span>
                <input type="tel" placeholder="+27 XX XXX XXXX" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={customer.phone} onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} required />
              </label>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total</span>
                <span className="text-primary">R{cartTotal}</span>
              </div>
              {checkoutError && <p className="text-sm text-destructive" role="alert">{checkoutError}</p>}
              <button type="submit" disabled={checkingOut} className="inline-flex items-center justify-center h-11 w-full rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:pointer-events-none disabled:opacity-50">
                {checkingOut ? 'Redirecting to PayFast...' : `Pay R${cartTotal} with PayFast`}
              </button>
            </form>
          </div>
        </div>
      )}

      {consultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setConsultOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card shadow-elegant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-medium">Book a Free Consultation</h3>
              <button type="button" aria-label="Close" onClick={() => setConsultOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {consultSent ? (
              <div className="text-center py-6">
                <p className="text-foreground font-medium mb-2">Thank you!</p>
                <p className="text-sm text-muted-foreground">We've received your request and will be in touch shortly to schedule your free skin consultation.</p>
              </div>
            ) : (
              <form onSubmit={submitConsultation} className="space-y-4">
                <label className="space-y-2 block">
                  <span className="text-sm font-medium">Full Name *</span>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={consultForm.name} onChange={(e) => setConsultForm((c) => ({ ...c, name: e.target.value }))} required />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-medium">Email Address *</span>
                  <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={consultForm.email} onChange={(e) => setConsultForm((c) => ({ ...c, email: e.target.value }))} required />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-medium">Phone Number *</span>
                  <input type="tel" placeholder="+27 XX XXX XXXX" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={consultForm.phone} onChange={(e) => setConsultForm((c) => ({ ...c, phone: e.target.value }))} required />
                </label>
                {consultError && <p className="text-sm text-destructive" role="alert">{consultError}</p>}
                <button type="submit" disabled={consultSubmitting} className="inline-flex items-center justify-center h-11 w-full rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:pointer-events-none disabled:opacity-50">
                  {consultSubmitting ? 'Sending...' : 'Request Consultation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
