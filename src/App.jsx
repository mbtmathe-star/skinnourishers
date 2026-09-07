import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Results from './pages/Results';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import { PaymentCancelled, PaymentSuccess } from './pages/PaymentStatus';
import NotFound from './pages/NotFound';
import { BookingProvider } from './components/BookingModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <BookingProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/results" element={<Results />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}
