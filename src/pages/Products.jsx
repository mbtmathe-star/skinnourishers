import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout';
import products from '../data/products.json';

export default function Products() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

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
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `Showing all ${products.length} results`}
            </p>
            <button type="button" aria-label="Open cart" className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent">
              <ShoppingBag className="h-5 w-5" />
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
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</span>
                      <h3 className="font-heading text-lg font-medium mt-1 mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      <p className="text-base font-semibold text-foreground">{product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 p-8 bg-secondary/30 rounded-2xl">
            <p className="text-lg text-foreground mb-2">Looking for personalized recommendations?</p>
            <p className="text-muted-foreground mb-4">Visit our clinic for a free skin consultation.</p>
            <a
              href="https://skinnourishers.booksy.com/a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
