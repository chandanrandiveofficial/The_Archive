import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiChevronDown } from 'react-icons/fi';

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('relevance');

  // All products data
  const allProducts = [
    {
      id: 1,
      name: 'Matte Black Desk Lamp',
      category: 'Lighting',
      price: '$242',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
      bgColor: 'bg-white'
    },
    {
      id: 2,
      name: 'Minimalist Steel Watch',
      category: 'Accessories',
      price: '$185',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      bgColor: 'bg-white',
      badge: 'BEST SELLER'
    },
    {
      id: 3,
      name: 'Concrete Coffee Table',
      category: 'Furniture',
      price: '$516',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&q=80',
      bgColor: 'bg-[#2C2C2C]'
    },
    {
      id: 4,
      name: 'Leather Weekend Bag',
      category: 'Accessories',
      price: '$340',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
      bgColor: 'bg-white'
    },
    {
      id: 5,
      name: 'Ceramic Vase Set',
      category: 'Decor',
      price: '$110',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80',
      bgColor: 'bg-[#F5E6D3]'
    },
    {
      id: 6,
      name: 'Geometric Rug',
      category: 'Textiles',
      price: '$402',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80',
      bgColor: 'bg-white',
      badge: 'NEW'
    },
    {
      id: 7,
      name: 'DriftKing Chair',
      category: 'Furniture',
      price: '$510',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80',
      bgColor: 'bg-[#F4F4F4]'
    },
    {
      id: 8,
      name: 'Hi-Fi Headphones',
      category: 'Electronics',
      price: '$299',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      bgColor: 'bg-[#1A1A1A]'
    },
    {
      id: 9,
      name: 'Brass Floor Lamp',
      category: 'Lighting',
      price: '$395',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80',
      bgColor: 'bg-[#2C2C2C]'
    },
    {
      id: 10,
      name: 'Wooden Cabinet',
      category: 'Furniture',
      price: '$685',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80',
      bgColor: 'bg-white'
    },
    {
      id: 11,
      name: 'Cotton Throw Blanket',
      category: 'Textiles',
      price: '$78',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80',
      bgColor: 'bg-[#E8E8E8]'
    },
    {
      id: 12,
      name: 'Porcelain Dinnerware Set',
      category: 'Decor',
      price: '$156',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80',
      bgColor: 'bg-white'
    },
    {
      id: 13,
      name: 'Wireless Speaker',
      category: 'Electronics',
      price: '$245',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
      bgColor: 'bg-white'
    },
    {
      id: 14,
      name: 'Leather Wallet',
      category: 'Accessories',
      price: '$89',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
      bgColor: 'bg-[#F5E6D3]'
    },
    {
      id: 15,
      name: 'Table Lamp',
      category: 'Lighting',
      price: '$178',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1534105615256-13940a56ff44?w=400&q=80',
      bgColor: 'bg-white'
    },
    {
      id: 16,
      name: 'Marble Bookends',
      category: 'Decor',
      price: '$65',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80',
      bgColor: 'bg-white'
    }
  ];

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

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All Categories'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <button className="flex hidden items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <span>Sort by: Relevance</span>
            <FiChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative"
            >
              {/* Wishlist Heart */}
              <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors">
                <FiHeart className="w-4 h-4" />
              </button>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded">
                  {product.badge}
                </div>
              )}

              {/* Product Image */}
              <div className={`${product.bgColor} aspect-square overflow-hidden mb-3 flex items-center justify-center`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-base flex-1">{product.name}</h3>
                  <span className="font-bold text-base ml-2">{product.price}</span>
                </div>
                <p className="text-sm text-gray-500">{product.category} • {product.year}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center text-sm text-gray-600">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;
