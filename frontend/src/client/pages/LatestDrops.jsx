import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LatestDrops = () => {
    const [collections, setCollections] = useState({ currentMonth: null, previousMonth: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLatestDrops();
    }, []);

    const fetchLatestDrops = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/products/featured/monthly?limit=20`);
            const result = await response.json();

            if (result.success) {
                setCollections(result.data);
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

    const formatPrice = (price) => `₹${price?.toFixed(0) || '0'}`;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    const hasProducts = (collections.currentMonth?.products.length > 0) || (collections.previousMonth?.products.length > 0);

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
                        Discover the newest additions from the last two months. These are the most recently added products to our curated collection.
                    </p>
                </div>

                {hasProducts ? (
                    <div className="space-y-16">
                        {/* Current Month */}
                        {collections.currentMonth?.products.length > 0 && (
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold">{collections.currentMonth.month}</h2>
                                    <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded uppercase tracking-wider">Present</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {collections.currentMonth.products.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/product/${product._id}`}
                                            className="group block"
                                        >
                                            <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-4 flex items-center justify-center rounded-lg">
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
                                                <p className="text-sm text-gray-500">{product.category}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Previous Month */}
                        {collections.previousMonth?.products.length > 0 && (
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold text-gray-400">{collections.previousMonth.month}</h2>
                                    <span className="text-gray-400 text-sm">{collections.previousMonth.year}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {collections.previousMonth.products.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/product/${product._id}`}
                                            className="group block opacity-90 hover:opacity-100 transition-opacity"
                                        >
                                            <div className="bg-[#F4F4F4] aspect-square overflow-hidden mb-4 flex items-center justify-center rounded-lg">
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
                                                <p className="text-sm text-gray-500">{product.category}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                        <FiCalendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xl text-gray-400">No new drops in the last 2 months</p>
                        <Link to="/allproducts" className="text-black font-semibold mt-4 inline-block hover:underline">Explore complete archive</Link>
                    </div>
                )}

                {/* View All Link */}
                <div className="mt-16 text-center">
                    <Link
                        to="/allproducts"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 font-medium hover:bg-gray-800 transition-colors rounded-full"
                    >
                        View Full Archive
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LatestDrops;
