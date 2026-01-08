import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    editorsPick: [],
    trendingProducts: [],
    moreLinks: [],
    copyrightText: '© 2025 The Archive. All rights reserved.',
    showPrivacyLink: true,
    showTermsLink: true,
    privacyUrl: '/privacy',
    termsUrl: '/terms'
  });

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
    <footer className="bg-[#F4F4F4] border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12">

          {/* Editor's Pick */}
          <div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-6">
              Editor's Pick
            </h3>
            <ul className="space-y-3">
              {settings.editorsPick.map((item, index) => (
                <li key={index}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#8E8E8E] hover:text-black transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.url}
                      className="text-base text-[#8E8E8E] hover:text-black transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Trending Now */}
          <div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-6">
              Trending Now
            </h3>
            <div className="flex gap-3">
              {settings.trendingProducts.map((product, index) => (
                <Link
                  key={index}
                  to={product.link || '#'}
                  className="group block w-24 h-24"
                >
                  <div className="bg-gray-100 w-full h-full overflow-hidden border border-gray-200">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name || `Trending product ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              ))}
              {settings.trendingProducts.length === 0 && (
                <p className="text-sm text-gray-400">No trending products</p>
              )}
            </div>
          </div>

          {/* More */}
          <div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-6">
              More
            </h3>
            <ul className="space-y-3">
              {settings.moreLinks.map((item, index) => (
                <li key={index}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#8E8E8E] hover:text-black transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.url}
                      className="text-base text-[#8E8E8E] hover:text-black transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#8E8E8E]">
            {settings.copyrightText}
          </p>
          <div className="flex gap-6">
            {settings.showPrivacyLink && (
              <Link
                to={settings.privacyUrl}
                className="text-xs text-[#8E8E8E] hover:text-black transition-colors"
              >
                Privacy
              </Link>
            )}
            {settings.showTermsLink && (
              <Link
                to={settings.termsUrl}
                className="text-xs text-[#8E8E8E] hover:text-black transition-colors"
              >
                Terms
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
