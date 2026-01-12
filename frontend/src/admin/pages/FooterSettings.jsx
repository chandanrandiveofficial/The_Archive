import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiRefreshCw } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FooterSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [productsList, setProductsList] = useState([]);

    const [settings, setSettings] = useState({
        trendingProducts: [],
        copyrightText: '© 2025 The Archive. All rights reserved.',
        showPrivacyLink: true,
        showTermsLink: true,
        privacyUrl: '/privacy',
        termsUrl: '/terms'
    });

    useEffect(() => {
        fetchSettings();
        fetchProductsList();
    }, []);

    const getAuthToken = () => localStorage.getItem('token');

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/settings/footer`);
            const result = await response.json();

            if (result.success) {
                setSettings(prev => ({
                    ...prev,
                    ...result.data,
                    trendingProducts: result.data.trendingProducts || []
                }));
            }
        } catch (err) {
            setError('Failed to load settings');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsList = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/settings/products-list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.success) {
                setProductsList(result.data);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const token = getAuthToken();
            const response = await fetch(`${API_URL}/settings/footer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...settings,
                    editorsPick: [], // Empty since we removed the section
                    moreLinks: []    // Empty since we removed the section
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Settings saved successfully!');
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(result.message || 'Failed to save');
            }
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const addTrendingProduct = () => {
        if (settings.trendingProducts.length >= 3) return;
        setSettings(prev => ({
            ...prev,
            trendingProducts: [...prev.trendingProducts, { productId: '', customImage: '', customLink: '' }]
        }));
    };

    const updateTrendingProduct = (index, field, value) => {
        setSettings(prev => {
            const updated = [...prev.trendingProducts];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, trendingProducts: updated };
        });
    };

    const removeTrendingProduct = (index) => {
        setSettings(prev => ({
            ...prev,
            trendingProducts: prev.trendingProducts.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 uppercase tracking-widest">
                    <Link to="/admin" className="hover:text-black">Dashboard</Link>
                    <IoIosArrowForward className="w-3 h-3" />
                    <span className="text-black font-bold">Footer Management</span>
                </nav>

                {/* Header */}
                <div className="flex items-start justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">FOOTER SETTINGS</h1>
                        <p className="text-sm text-gray-500 uppercase tracking-widest">Manage Trending Now products and copyright info.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchSettings}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <FiRefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 font-bold text-xs uppercase tracking-widest"
                        >
                            <FiSave className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm border border-red-100">{error}</div>}
                {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm border border-green-100">{success}</div>}

                <div className="space-y-8">

                    {/* Trending Products Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight">TRENDING NOW</h2>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Select up to 3 showcase products</p>
                            </div>
                            {settings.trendingProducts.length < 3 && (
                                <button
                                    onClick={addTrendingProduct}
                                    className="flex items-center gap-2 px-4 py-2 bg-zinc-50 text-black border border-zinc-200 rounded-lg hover:bg-zinc-100 text-xs font-bold uppercase tracking-widest"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {settings.trendingProducts.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-6 p-6 bg-zinc-50 rounded-xl border border-zinc-100 relative group">
                                    {/* Preview */}
                                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-zinc-200">
                                        {(item.customImage || item.image) ? (
                                            <img
                                                src={item.customImage || item.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center px-1">
                                                No Preview
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Product</label>
                                            <select
                                                value={item.productId || ''}
                                                onChange={(e) => updateTrendingProduct(index, 'productId', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white text-sm"
                                            >
                                                <option value="">Manual Override / No Product</option>
                                                {productsList.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Custom Image URL</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    value={item.customImage || ''}
                                                    onChange={(e) => updateTrendingProduct(index, 'customImage', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Custom Link</label>
                                                <input
                                                    type="text"
                                                    placeholder="/product/..."
                                                    value={item.customLink || ''}
                                                    onChange={(e) => updateTrendingProduct(index, 'customLink', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeTrendingProduct(index)}
                                        className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {settings.trendingProducts.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-zinc-100 rounded-xl">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Add up to 3 trending items</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Legal Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-lg font-bold tracking-tight mb-6 uppercase tracking-widest">General Info</h2>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Copyright Text</label>
                                <input
                                    type="text"
                                    value={settings.copyrightText}
                                    onChange={(e) => setSettings(prev => ({ ...prev, copyrightText: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.showPrivacyLink}
                                        onChange={(e) => setSettings(prev => ({ ...prev, showPrivacyLink: e.target.checked }))}
                                        className="rounded border-zinc-300 text-black focus:ring-0"
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Privacy Policy</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.showTermsLink}
                                        onChange={(e) => setSettings(prev => ({ ...prev, showTermsLink: e.target.checked }))}
                                        className="rounded border-zinc-300 text-black focus:ring-0"
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Terms of Service</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FooterSettings;
