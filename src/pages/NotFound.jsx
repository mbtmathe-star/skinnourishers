import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();
  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center sec-mist">
      <div className="text-center">
        <span className="eyebrow mb-3" style={{ display: 'inline-block' }}>Page not found</span>
        <h1 className="d1 mb-4">404</h1>
        <p className="lede mb-6" style={{ marginInline: 'auto' }}>Oops! That page doesn&rsquo;t exist.</p>
        <a href="/" className="btn-ref">Return to Home</a>
      </div>
    </div>
  );
}
