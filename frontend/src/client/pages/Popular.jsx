import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Popular = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const categories = [
    'All Products',
    'Furniture',
    'Accessories',
    'Arts',
    'Apps',
    'Agriculture',
    'Automative and Industrial',
    'Baby, Kids & Parenting',
    'Beauty, Personal Care & Wellness',
    'B2B, Industrial & Manufacturing',
    'D2C Brands & Consumer Products',
    'Fashion, Apparel & Accessories',
    'Entertainment',
    'Education, Learning & EdTech',
    'Electric Vehicles, Mobility & Transport',
    'Food, Beverage & FMCG',
    'Health, Fitness & Medical',
    'Home, Kitchen & Lifestyle',
    'Services & Marketplaces',
    'Sustainability & Green Products',
    'Sports & Outdoor',
    'Gift',
    'Tech & Electronics',
    'Miscellaneous',
    'Lighting',
    'Decor'
  ];

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const fetchBestsellers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/featured/bestsellers?limit=12`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching bestsellers:', err);
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

  const filteredProducts = selectedCategory === 'All Products'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const featuredProduct = filteredProducts[0];
  const gridProducts = filteredProducts.slice(1);

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
          <button onClick={fetchBestsellers} className="bg-black text-white px-6 py-2 rounded-full">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Most Desired</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore the items our clients are loving right now. A curated selection of top-tier designs that define modern aesthetics.
          </p>
        </div>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <span>Sort by: Popularity</span>
            <FiChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8">
          {selectedCategory === 'All Products' && featuredProduct && (
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Link to={`/product/${featuredProduct._id}`} className="group relative">
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded">
                  FEATURED
                </div>
                <div className="bg-[#E8E8E8] aspect-[4/3] overflow-hidden flex items-center justify-center">
                  <img
                    src={getImageUrl(featuredProduct)}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="flex flex-col justify-center">
                <p className="text-sm text-gray-500 mb-2">
                  {featuredProduct.category} • {featuredProduct.month} {featuredProduct.year}
                </p>
                <h2 className="text-3xl font-bold mb-4">{featuredProduct.name}</h2>
                <p className="text-gray-600 mb-6">{featuredProduct.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">{formatPrice(featuredProduct.price)}</span>
                  <Link
                    to={`/product/${featuredProduct._id}`}
                    className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                  >
                    View Product <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {gridProducts.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="group relative">
                {product.visibility?.bestSelling && (
                  <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded">
                    BEST SELLER
                  </div>
                )}
                <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-3 flex items-center justify-center">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{product.category} • {product.month}</p>
                    <span className="font-bold text-base">{formatPrice(product.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;
