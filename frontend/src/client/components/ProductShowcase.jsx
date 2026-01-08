import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductShowcase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    bestsellers: [],
    editorsPick: [],
    currentMonth: { year: 2026, month: 'January', monthShort: 'JAN', products: [] },
    previousMonth: { year: 2025, month: 'December', monthShort: 'DEC', products: [] },
    yearlyCollections: [],
  });

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/featured/homepage`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const url = product.images[0].url;
      if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http')) {
        return url;
      }
      return `/${url}`;
    }
    return '/hero.png';
  };

  const formatPrice = (price) => `$${price.toFixed(0)}`;

  if (loading) {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchHomepageData} className="mt-4 bg-black text-white px-6 py-2 rounded-full">
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products-showcase" className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Curated Bestsellers */}
        {data.bestsellers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-6">Curated Bestsellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {data.bestsellers.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group block">
                  <div className="bg-[#F4F4F4] aspect-[4/3] overflow-hidden mb-3 flex items-center justify-center">
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-0.5">{product.name}</h3>
                      <p className="text-base text-[#8E8E8E]">{product.category}</p>
                    </div>
                    <span className="text-base font-bold text-black">{formatPrice(product.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Editor's Pick */}
        {data.editorsPick.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-6">Editor's <span className="font-light text-[#8E8E8E]">Pick</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {data.editorsPick.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group block relative">
                  <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded">EDITOR'S PICK</div>
                  <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-3 flex items-center justify-center">
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-black mb-0.5">{product.name}</h3>
                      <p className="text-sm text-[#8E8E8E]">{product.category}</p>
                    </div>
                    <span className="text-base font-bold text-black">{formatPrice(product.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link to="/editorspick" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">Show More</Link>
            </div>
          </div>
        )}

        {/* Current Month */}
        {data.currentMonth.products.length > 0 && (
          <div className="mb-16">
            <h2 className="text-base font-bold text-black mb-4">
              <span className="mr-1 text-2xl">{data.currentMonth.year}</span>
              <span className="text-[#8E8E8E] font-light text-2xl">{data.currentMonth.monthShort}</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {data.currentMonth.products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group block">
                  <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-3 flex items-center justify-center">
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-0.5">{product.name}</h3>
                    <p className="text-base text-[#8E8E8E]">{product.month}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link to={`/allproducts?year=${data.currentMonth.year}&month=${data.currentMonth.month}`} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">Show More</Link>
            </div>
          </div>
        )}

        {/* Previous Month */}
        {data.previousMonth.products.length > 0 && (
          <div className="mb-16">
            <h2 className="text-base font-bold text-black mb-4">
              <span className="mr-1 text-2xl">{data.previousMonth.year}</span>
              <span className="text-[#8E8E8E] font-light text-2xl">{data.previousMonth.monthShort}</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {data.previousMonth.products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group block">
                  <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-3 flex items-center justify-center">
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-0.5">{product.name}</h3>
                    <p className="text-base text-[#8E8E8E]">{product.month}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link to={`/allproducts?year=${data.previousMonth.year}&month=${data.previousMonth.month}`} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">Show More</Link>
            </div>
          </div>
        )}

        {/* Yearly Collections */}
        {data.yearlyCollections.map((yearData) => (
          <div key={yearData.year} className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-6">{yearData.year}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {yearData.products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group block">
                  <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-3 flex items-center justify-center">
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-black mb-0.5">{product.name}</h3>
                    <p className="text-sm text-[#8E8E8E]">{product.month}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link to={`/allproducts?year=${yearData.year}`} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">Show All {yearData.year} Products</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
