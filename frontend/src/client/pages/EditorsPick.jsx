import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditorsCuration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEditorsPick();
  }, []);

  const fetchEditorsPick = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/featured/editorspick?limit=20`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching editors pick:', err);
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

  const formatPrice = (price) => `₹${price.toFixed(0)}`;

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="group cursor-pointer relative block">
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded">
          EDITOR'S PICK
        </span>
      </div>
      <div className="bg-gray-100 rounded-lg aspect-square mb-4 overflow-hidden flex items-center justify-center">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-base group-hover:text-gray-600 transition-colors flex-1">
            {product.name}
          </h3>
          <span className="font-semibold text-base whitespace-nowrap">{formatPrice(product.price)}</span>
        </div>
        <p className="text-sm text-gray-600">{product.category}</p>
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
          <button onClick={fetchEditorsPick} className="bg-black text-white px-6 py-2 rounded-full">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">The Editor's Curation</h1>
          <p className="text-lg text-gray-700 mb-2 max-w-3xl">
            A selection of timeless essentials chosen for their design and utility.
          </p>
          <p className="text-base text-gray-600 max-w-3xl">
            Every item tells a story of craftsmanship and minimalist aesthetic.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No editor's picks available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorsCuration;
