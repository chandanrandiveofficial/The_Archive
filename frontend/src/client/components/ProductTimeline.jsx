import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiCalendar } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductTimeline = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [visibleCounts, setVisibleCounts] = useState({});
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  const INITIAL_COUNT = 8;
  const INCREMENT_COUNT = 4;

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/products/timeline`);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setTimelineData(result.data);
        // Set the most recent year as default
        const sortedYears = result.data.map(d => d._id).sort((a, b) => b - a);
        setSelectedYear(sortedYears[0].toString());
      } else {
        setError('No products found');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const availableYears = timelineData.map(d => d._id.toString()).sort((a, b) => b - a);

  // Get months for selected year
  const getMonthsForYear = () => {
    const yearData = timelineData.find(d => d._id.toString() === selectedYear);
    if (!yearData) return {};

    const months = {};
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Sort months in reverse order (most recent first)
    yearData.months
      .sort((a, b) => monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month))
      .forEach(m => {
        if (m.products.length > 0) {
          months[m.month] = m.products;
        }
      });

    return months;
  };

  const months = getMonthsForYear();

  // Calculate total items for selected year
  const totalItems = Object.values(months).reduce((sum, products) => sum + products.length, 0);

  const getVisibleCount = (month) => {
    return visibleCounts[month] || INITIAL_COUNT;
  };

  const showMore = (month) => {
    setVisibleCounts(prev => ({
      ...prev,
      [month]: getVisibleCount(month) + INCREMENT_COUNT
    }));
  };

  const showLess = (month) => {
    setVisibleCounts(prev => ({
      ...prev,
      [month]: INITIAL_COUNT
    }));
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const url = product.images[0].url;
      if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http') || url.startsWith('blob:')) {
        return url;
      }
      return `/${url}`;
    }
    return '/hero.png';
  };

  const formatPrice = (price) => `₹${price?.toFixed(0) || 0}`;

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="group cursor-pointer block">
      <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden flex items-center justify-center">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="font-semibold text-sm">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchTimeline} className="bg-black text-white px-6 py-2 rounded-full">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Product Timeline</h2>
          <p className="text-gray-600 text-sm">Explore our curated collections by year</p>
        </div>

        {/* Year Filter and Items Count */}
        <div className="flex items-center gap-4">
          {/* Items Count */}
          <span className="text-sm text-gray-500">{totalItems} items</span>

          {/* Year Filter */}
          <div className="relative">
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{selectedYear}</span>
              </div>
              <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isYearDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsYearDropdownOpen(false);
                      setVisibleCounts({});
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedYear === year ? 'bg-gray-100 font-medium' : ''
                      }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Month Sections */}
      <div className="space-y-12">
        {Object.entries(months).map(([month, products]) => {
          const visibleCount = getVisibleCount(month);
          const visibleProducts = products.slice(0, visibleCount);
          const hasMore = visibleCount < products.length;
          const isExpanded = visibleCount > INITIAL_COUNT;

          return (
            <div key={month}>
              {/* Month Header */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b">
                <h2 className="text-2xl font-bold">{month}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{products.length} items</span>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {visibleProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Show More/Less Buttons */}
              {(hasMore || isExpanded) && (
                <div className="flex justify-center gap-3">
                  {hasMore && (
                    <button
                      onClick={() => showMore(month)}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      Show More from {month}
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                  )}

                  {isExpanded && (
                    <button
                      onClick={() => showLess(month)}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      Show Less
                      <FiChevronDown className="w-4 h-4 rotate-180" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {Object.keys(months).length === 0 && (
        <div className="text-center py-20">
          <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">No products available for {selectedYear}</p>
        </div>
      )}
    </div>
  );
};

export default ProductTimeline;
