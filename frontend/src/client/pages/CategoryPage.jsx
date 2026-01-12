import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    'All Categories',
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'name', label: 'Name: A to Z' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_URL}/products?limit=100&sortBy=${sortBy}`;
      if (selectedCategory !== 'All Categories') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);
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

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(o => o.value === sortBy);
    return option ? option.label : 'Sort by';
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h1>
          <p className="text-gray-600">
            Navigate through our design timeline. Select a category to filter our curated collection of modern artifacts and essentials.
          </p>
        </div>

        {/* Filter Bar */}
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

          {/* Sort By Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Sort: {getCurrentSortLabel()}</span>
              <FiChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close sort menu */}
        {showSortMenu && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSortMenu(false)}
          />
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchProducts} className="bg-black text-white px-6 py-2 rounded-full">
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!error && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative"
              >


                {/* Badges */}
                {product.visibility?.bestSelling && (
                  <div className="absolute top-3 left-3 z-10 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-2 py-1 rounded">
                    BEST SELLER
                  </div>
                )}
                {product.visibility?.editorsPick && (
                  <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded">
                    EDITOR'S PICK
                  </div>
                )}

                {/* Product Image */}
                <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-3 flex items-center justify-center rounded-lg">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-base flex-1">{product.name}</h3>
                    <span className="font-bold text-base ml-2">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{product.category} • {product.year}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && products.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found in {selectedCategory}</p>
          </div>
        )}

        {/* Results Count */}
        {products.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
