import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const [expandedMonths, setExpandedMonths] = useState({});
  const [collapsedYears, setCollapsedYears] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const INITIAL_COUNT = 8;
  const INCREMENT_COUNT = 4;

  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (yearParam && monthParam) {
      setCollapsedYears(prev => ({ ...prev, [yearParam]: false }));
      const yearMonth = `${yearParam}-${monthParam}`;
      setExpandedMonths(prev => ({ ...prev, [yearMonth]: INITIAL_COUNT }));
      setTimeout(() => {
        const element = document.getElementById(yearMonth);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
      }, 100);
    } else if (yearParam) {
      setCollapsedYears(prev => ({ ...prev, [yearParam]: false }));
      setTimeout(() => {
        const element = document.getElementById(`year-${yearParam}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [yearParam, monthParam, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products?limit=200`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group products by year and month
  const groupedProducts = products.reduce((acc, product) => {
    const year = product.year;
    const month = product.month;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(product);
    return acc;
  }, {});

  // Sort years descending
  const sortedYears = Object.keys(groupedProducts).sort((a, b) => b - a);

  const getVisibleCount = (yearMonth) => expandedMonths[yearMonth] || INITIAL_COUNT;

  const showMore = (yearMonth) => {
    setExpandedMonths(prev => ({ ...prev, [yearMonth]: getVisibleCount(yearMonth) + INCREMENT_COUNT }));
  };

  const showLess = (yearMonth) => {
    setExpandedMonths(prev => ({ ...prev, [yearMonth]: INITIAL_COUNT }));
  };

  const toggleYear = (year) => {
    setCollapsedYears(prev => ({ ...prev, [year]: !prev[year] }));
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

  const formatPrice = (price) => `₹${price.toFixed(0)}`;

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="group cursor-pointer block">
      <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden flex items-center justify-center">
        <img src={getImageUrl(product)} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm group-hover:text-gray-600 transition-colors">{product.name}</h3>
        <p className="font-semibold text-sm">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchProducts} className="bg-black text-white px-6 py-2 rounded-full">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sortedYears.map((year) => {
          const months = groupedProducts[year];
          const isYearCollapsed = collapsedYears[year];
          const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const sortedMonths = Object.keys(months).sort((a, b) => monthOrder.indexOf(b) - monthOrder.indexOf(a));

          return (
            <div key={year} id={`year-${year}`} className="mb-12">
              <button onClick={() => toggleYear(year)} className="flex items-center gap-2 mb-8 hover:text-gray-600 transition-colors">
                <h2 className="text-4xl font-bold">{year}</h2>
                {isYearCollapsed ? <FiChevronDown className="w-6 h-6" /> : <FiChevronUp className="w-6 h-6" />}
              </button>

              {!isYearCollapsed && (
                <div className="space-y-12">
                  {sortedMonths.map((month) => {
                    const monthProducts = months[month];
                    const yearMonth = `${year}-${month}`;
                    const visibleCount = getVisibleCount(yearMonth);
                    const visibleProducts = monthProducts.slice(0, visibleCount);
                    const hasMore = visibleCount < monthProducts.length;
                    const isExpanded = visibleCount > INITIAL_COUNT;

                    return (
                      <div key={month} id={yearMonth}>
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold mb-1">{month}</h3>
                          <p className="text-sm text-gray-500">{monthProducts.length} Products</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                          {visibleProducts.map(product => <ProductCard key={product._id} product={product} />)}
                        </div>
                        {(hasMore || isExpanded) && (
                          <div className="flex justify-center gap-3">
                            {hasMore && (
                              <button onClick={() => showMore(yearMonth)} className="px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2">
                                EXPLORE MORE <FiChevronDown className="w-4 h-4" />
                              </button>
                            )}
                            {isExpanded && (
                              <button onClick={() => showLess(yearMonth)} className="px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2">
                                Show Less <FiChevronUp className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {sortedYears.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
