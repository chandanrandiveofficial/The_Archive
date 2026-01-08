import React, { useState } from 'react';
import { FiChevronDown, FiCalendar } from 'react-icons/fi';

// Sample product data
const productData = {
  2024: {
    October: [
      { id: 1, name: 'Eames Lounge Chair', price: '$314', image: 'chair.jpg', category: 'Furniture' },
      { id: 2, name: 'Ceramic Vase', price: '$149', image: 'vase.jpg', category: 'Decor' },
      { id: 3, name: 'Table Lamp', price: '$99', image: 'lamp.jpg', category: 'Lighting' },
      { id: 4, name: 'Minimalist Clock', price: '$89', image: 'clock.jpg', category: 'Decor' },
      { id: 5, name: 'Textured Rug', price: '$499', image: 'rug.jpg', category: 'Furniture' },
      { id: 6, name: 'Coffee Table', price: '$449', image: 'table.jpg', category: 'Furniture' },
      { id: 7, name: 'Wall Art', price: '$250', image: 'art.jpg', category: 'Decor' },
      { id: 8, name: 'Storage Unit', price: '$350', image: 'storage.jpg', category: 'Furniture' },
      { id: 9, name: 'Pendant Light', price: '$199', image: 'pendant.jpg', category: 'Lighting' },
      { id: 10, name: 'Side Table', price: '$299', image: 'sidetable.jpg', category: 'Furniture' },
      { id: 11, name: 'Floor Lamp', price: '$279', image: 'floorlamp.jpg', category: 'Lighting' },
      { id: 12, name: 'Decorative Mirror', price: '$189', image: 'mirror.jpg', category: 'Decor' },
    ],
    September: [
      { id: 13, name: 'Coffee Table', price: '$449', image: 'table.jpg', category: 'Furniture' },
      { id: 14, name: 'Wall Art', price: '$250', image: 'art.jpg', category: 'Decor' },
      { id: 15, name: 'Textured Rug', price: '$499', image: 'rug.jpg', category: 'Furniture' },
      { id: 16, name: 'Minimalist Clock', price: '$89', image: 'clock.jpg', category: 'Decor' },
      { id: 17, name: 'Desk Lamp', price: '$159', image: 'desk.jpg', category: 'Lighting' },
      { id: 18, name: 'Ceramic Vase', price: '$149', image: 'vase2.jpg', category: 'Decor' },
      { id: 19, name: 'Storage Unit', price: '$350', image: 'storage2.jpg', category: 'Furniture' },
      { id: 20, name: 'Bookshelf', price: '$599', image: 'bookshelf.jpg', category: 'Furniture' },
      { id: 21, name: 'Ottoman', price: '$229', image: 'ottoman.jpg', category: 'Furniture' },
      { id: 22, name: 'Table Runner', price: '$45', image: 'runner.jpg', category: 'Decor' },
    ],
    August: [
      { id: 23, name: 'Dining Chair', price: '$199', image: 'dining.jpg', category: 'Furniture' },
      { id: 24, name: 'Chandelier', price: '$699', image: 'chandelier.jpg', category: 'Lighting' },
      { id: 25, name: 'Abstract Art', price: '$320', image: 'abstract.jpg', category: 'Decor' },
      { id: 26, name: 'Console Table', price: '$549', image: 'console.jpg', category: 'Furniture' },
      { id: 27, name: 'Throw Pillows', price: '$79', image: 'pillows.jpg', category: 'Decor' },
      { id: 28, name: 'Bar Stool', price: '$169', image: 'stool.jpg', category: 'Furniture' },
      { id: 29, name: 'Sconce Light', price: '$139', image: 'sconce.jpg', category: 'Lighting' },
      { id: 30, name: 'Planter Set', price: '$89', image: 'planter.jpg', category: 'Decor' },
      { id: 31, name: 'Accent Chair', price: '$429', image: 'accent.jpg', category: 'Furniture' },
    ]
  },
  2023: {
    December: [
      { id: 32, name: 'Holiday Wreath', price: '$59', image: 'wreath.jpg', category: 'Decor' },
      { id: 33, name: 'String Lights', price: '$39', image: 'strings.jpg', category: 'Lighting' },
      { id: 34, name: 'Gift Box Set', price: '$29', image: 'giftbox.jpg', category: 'Decor' },
      { id: 35, name: 'Candle Holder', price: '$49', image: 'candle.jpg', category: 'Decor' },
      { id: 36, name: 'Table Centerpiece', price: '$79', image: 'centerpiece.jpg', category: 'Decor' },
      { id: 37, name: 'Ornament Set', price: '$45', image: 'ornaments.jpg', category: 'Decor' },
      { id: 38, name: 'Snow Globe', price: '$35', image: 'globe.jpg', category: 'Decor' },
      { id: 39, name: 'Festive Runner', price: '$55', image: 'festive.jpg', category: 'Decor' },
      { id: 40, name: 'LED Tree', price: '$129', image: 'tree.jpg', category: 'Lighting' },
    ],
    November: [
      { id: 41, name: 'Autumn Wreath', price: '$49', image: 'autumn.jpg', category: 'Decor' },
      { id: 42, name: 'Harvest Bowl', price: '$65', image: 'bowl.jpg', category: 'Decor' },
      { id: 43, name: 'Wooden Cabinet', price: '$799', image: 'cabinet.jpg', category: 'Furniture' },
      { id: 44, name: 'Reading Chair', price: '$459', image: 'reading.jpg', category: 'Furniture' },
      { id: 45, name: 'Floor Rug', price: '$549', image: 'floorrug.jpg', category: 'Furniture' },
      { id: 46, name: 'Desk Organizer', price: '$39', image: 'organizer.jpg', category: 'Decor' },
      { id: 47, name: 'Task Light', price: '$119', image: 'task.jpg', category: 'Lighting' },
      { id: 48, name: 'Coat Rack', price: '$89', image: 'rack.jpg', category: 'Furniture' },
      { id: 49, name: 'Bench Seat', price: '$329', image: 'bench.jpg', category: 'Furniture' },
      { id: 50, name: 'Wall Shelf', price: '$129', image: 'shelf.jpg', category: 'Furniture' },
    ]
  }
};

const ProductTimeline = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [visibleCounts, setVisibleCounts] = useState({});
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const availableYears = Object.keys(productData);
  const months = productData[selectedYear] || {};

  const INITIAL_COUNT = 8;
  const INCREMENT_COUNT = 4;

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

  const ProductCard = ({ product }) => (
    <div className="group cursor-pointer">
      <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
          <span className="text-sm font-medium">{product.name}</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="font-semibold text-sm">{product.price}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Timeline</h1>
            <p className="text-gray-600 text-sm">Explore our curated collections by year</p>
          </div>
          
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
                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedYear === year ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
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
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      Filter
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {visibleProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
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
    </div>
  );
};

export default ProductTimeline;
