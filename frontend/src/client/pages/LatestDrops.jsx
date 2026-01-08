import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LatestDrops = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLatestProducts();
    }, []);

    const fetchLatestProducts = async () => {
        try {
            setLoading(true);
            // Fetch the 20 most recently added products
            const response = await fetch(`${API_URL}/products?limit=20&sortBy=newest`);
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
            if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http')) {
                return url;
            }
            return `/${url}`;
        }
        return '/hero.png';
    };

    const formatPrice = (price) => `$${price?.toFixed(0) || '0'}`;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

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
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button onClick={fetchLatestProducts} className="bg-black text-white px-6 py-2 rounded-full">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-12 bg-black"></div>
                        <span className="text-xs text-gray-500 tracking-[0.2em] uppercase font-medium">
                            Fresh Arrivals
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold text-black mb-4">Latest Drops</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        Discover the newest additions to our curated collection. These are the most recently added products,
                        fresh off our curation desk.
                    </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {products.map((product, index) => (
                            <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                className="group block relative"
                            >
                                {/* New Badge for first 5 items */}
                                {index < 5 && (
                                    <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                                        New
                                    </div>
                                )}

                                <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-4 flex items-center justify-center">
                                    <img
                                        src={getImageUrl(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-base text-black group-hover:text-gray-600 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <span className="font-bold text-base text-black whitespace-nowrap">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                        <span className="text-xs text-gray-400">
                                            {formatDate(product.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No products found</p>
                    </div>
                )}

                {/* View All Link */}
                <div className="mt-12 text-center">
                    <Link
                        to="/allproducts"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 font-medium hover:bg-gray-800 transition-colors rounded-full"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LatestDrops;
