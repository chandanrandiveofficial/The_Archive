import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    copyrightText: '© 2025 THE ARCHIVE. ALL RIGHTS RESERVED.',
    showPrivacyLink: true,
    showTermsLink: true,
    privacyUrl: '/privacy',
    termsUrl: '/terms'
  });

  const quickLinks = [
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
        setSettings(prev => ({ ...prev, ...result.data }));
      }
    } catch (err) {
      console.error('Error fetching footer settings:', err);
    }
  };

  return (
    <footer className="bg-[#f8f8f8] border-t border-zinc-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-5 py-6 md:px-6 md:py-10 max-w-[1200px]">

        {/* Logo Section - Full width on top */}
        <div className="mb-6 md:mb-0 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-md">
              <span className="font-bold text-lg">⬡</span>
            </div>
            <span className="font-black text-base tracking-tight text-black">THE ARCHIVE</span>
          </div>
        </div>

        {/* Desktop 3-column, Mobile 2-column for links */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">

          {/* Logo Section - Desktop Only */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2.5">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-md">
                <span className="font-bold text-lg">⬡</span>
              </div>
              <span className="font-black text-base tracking-tight text-black">THE ARCHIVE</span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.3em] mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[14px] text-zinc-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.3em] mb-3">
              Contact Info
            </h4>

            <div className="space-y-2">
              <div>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider mb-0.5">Email Us</p>
                <a href="mailto:chandan.randive.official@gmail.com" className="text-[13px] md:text-[14px] text-zinc-800 hover:text-black transition-colors break-all">
                  chandan.randive.official@gmail.com
                </a>
              </div>

              <div>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider mb-0.5">Call Us</p>
                <a href="tel:+919370224656" className="text-[14px] text-zinc-800 hover:text-black transition-colors">
                  +91 93702 24656
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200">
        <div className="container mx-auto px-5 py-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex gap-4">
              {settings.showPrivacyLink && (
                <Link
                  to={settings.privacyUrl}
                  className="text-[10px] font-medium text-zinc-500 hover:text-black uppercase tracking-[0.1em] transition-colors"
                >
                  Privacy Policy
                </Link>
              )}
              {settings.showTermsLink && (
                <Link
                  to={settings.termsUrl}
                  className="text-[10px] font-medium text-zinc-500 hover:text-black uppercase tracking-[0.1em] transition-colors"
                >
                  Terms of Service
                </Link>
              )}
            </div>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.1em]">
              {settings.copyrightText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

