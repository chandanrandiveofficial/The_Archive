import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    trendingProducts: [],
    copyrightText: '© 2025 The Archive. All rights reserved.',
    showPrivacyLink: true,
    showTermsLink: true,
    privacyUrl: '/privacy',
    termsUrl: '/terms'
  });

  const navLinks = [
    { name: 'All Products', path: '/allproducts' },
    { name: 'Popular', path: '/popular' },
    { name: 'Monthly', path: '/monthly' },
    { name: 'Category', path: '/category' },
    { name: 'More', path: '/more' },
  ];

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings/footer`);
      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
      }
    } catch (err) {
      console.error('Error fetching footer settings:', err);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '/hero.png';
    if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http')) {
      return url;
    }
    return `/${url}`;
  };

  return (
    <footer className="bg-white border-t border-zinc-100 py-20">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col items-center text-center">

          {/* Main Navigation (Same as Header) */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-16">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Trending Now Section */}
          <div className="w-full max-w-2xl mb-20">
            <h3 className="text-[10px] font-bold text-black uppercase tracking-[0.5em] mb-10 opacity-30">
              Trending Now
            </h3>
            <div className="flex gap-4 sm:gap-8 justify-center items-center">
              {settings.trendingProducts.map((product, index) => (
                <Link
                  key={index}
                  to={product.link || '#'}
                  className="group block w-20 h-20 sm:w-28 sm:h-28"
                >
                  <div className="bg-zinc-50 w-full h-full overflow-hidden border border-zinc-100 transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name || `Trending product ${index + 1}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Logo in Footer */}
          <div className="mb-12">
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-base">⬡</span>
            </div>
            <span className="font-black text-sm tracking-tight text-black">THE ARCHIVE</span>
          </div>

          {/* Legal Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-4">
            {settings.showPrivacyLink && (
              <Link to={settings.privacyUrl} className="text-[9px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest">Privacy Policy</Link>
            )}
            {settings.showTermsLink && (
              <Link to={settings.termsUrl} className="text-[9px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest">Terms of Service</Link>
            )}
          </div>

          <p className="text-[9px] font-medium text-zinc-300 uppercase tracking-[0.2em]">
            {settings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
