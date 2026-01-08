import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FooterSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [productsList, setProductsList] = useState([]);

    const [settings, setSettings] = useState({
        editorsPick: [],
        moreLinks: [],
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
                body: JSON.stringify(settings)
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

    // Editor's Pick handlers
    const addEditorsPickLink = () => {
        setSettings(prev => ({
            ...prev,
            editorsPick: [...prev.editorsPick, { label: '', url: '', isExternal: false }]
        }));
    };

    const updateEditorsPickLink = (index, field, value) => {
        setSettings(prev => {
            const updated = [...prev.editorsPick];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, editorsPick: updated };
        });
    };

    const removeEditorsPickLink = (index) => {
        setSettings(prev => ({
            ...prev,
            editorsPick: prev.editorsPick.filter((_, i) => i !== index)
        }));
    };

    // More Links handlers
    const addMoreLink = () => {
        setSettings(prev => ({
            ...prev,
            moreLinks: [...prev.moreLinks, { label: '', url: '', isExternal: false }]
        }));
    };

    const updateMoreLink = (index, field, value) => {
        setSettings(prev => {
            const updated = [...prev.moreLinks];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, moreLinks: updated };
        });
    };

    const removeMoreLink = (index) => {
        setSettings(prev => ({
            ...prev,
            moreLinks: prev.moreLinks.filter((_, i) => i !== index)
        }));
    };

    // Trending Products handlers
    const addTrendingProduct = () => {
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/admin" className="hover:text-black">Dashboard</Link>
                    <IoIosArrowForward className="w-4 h-4" />
                    <span className="text-black font-medium">Footer Settings</span>
                </nav>

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">Footer Settings</h1>
                        <p className="text-gray-600">Manage footer links, trending products, and legal information.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchSettings}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Refresh"
                        >
                            <FiRefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            <FiSave className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                        {success}
                    </div>
                )}

                <div className="space-y-8">

                    {/* Editor's Pick Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-black">Editor's Pick</h2>
                                <p className="text-sm text-gray-500">Links displayed in the footer's Editor's Pick section</p>
                            </div>
                            <button
                                onClick={addEditorsPickLink}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Link
                            </button>
                        </div>

                        <div className="space-y-4">
                            {settings.editorsPick.map((link, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Label (e.g., Design Systems 2024)"
                                            value={link.label}
                                            onChange={(e) => updateEditorsPickLink(index, 'label', e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL (e.g., /editorspick)"
                                            value={link.url}
                                            onChange={(e) => updateEditorsPickLink(index, 'url', e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={link.isExternal}
                                            onChange={(e) => updateEditorsPickLink(index, 'isExternal', e.target.checked)}
                                            className="rounded"
                                        />
                                        <FiExternalLink className="w-4 h-4" />
                                    </label>
                                    <button
                                        onClick={() => removeEditorsPickLink(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {settings.editorsPick.length === 0 && (
                                <p className="text-gray-400 text-center py-6">No links added. Click "Add Link" to create one.</p>
                            )}
                        </div>
                    </div>

                    {/* More Links Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-black">More Links</h2>
                                <p className="text-sm text-gray-500">Links displayed in the footer's More section</p>
                            </div>
                            <button
                                onClick={addMoreLink}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Link
                            </button>
                        </div>

                        <div className="space-y-4">
                            {settings.moreLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Label (e.g., About Us)"
                                            value={link.label}
                                            onChange={(e) => updateMoreLink(index, 'label', e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL (e.g., /about)"
                                            value={link.url}
                                            onChange={(e) => updateMoreLink(index, 'url', e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={link.isExternal}
                                            onChange={(e) => updateMoreLink(index, 'isExternal', e.target.checked)}
                                            className="rounded"
                                        />
                                        <FiExternalLink className="w-4 h-4" />
                                    </label>
                                    <button
                                        onClick={() => removeMoreLink(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {settings.moreLinks.length === 0 && (
                                <p className="text-gray-400 text-center py-6">No links added. Click "Add Link" to create one.</p>
                            )}
                        </div>
                    </div>

                    {/* Trending Products Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-black">Trending Now</h2>
                                <p className="text-sm text-gray-500">Products displayed in the Trending Now section (max 3)</p>
                            </div>
                            {settings.trendingProducts.length < 3 && (
                                <button
                                    onClick={addTrendingProduct}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add Product
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {settings.trendingProducts.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    {/* Preview */}
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image || item.customImage ? (
                                            <img
                                                src={item.customImage || item.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <select
                                            value={item.productId || ''}
                                            onChange={(e) => updateTrendingProduct(index, 'productId', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                        >
                                            <option value="">Select a product (optional)</option>
                                            {productsList.map(p => (
                                                <option key={p._id} value={p._id}>{p.name} - {p.category}</option>
                                            ))}
                                        </select>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Custom Image URL (optional)"
                                                value={item.customImage || ''}
                                                onChange={(e) => updateTrendingProduct(index, 'customImage', e.target.value)}
                                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Custom Link URL (optional)"
                                                value={item.customLink || ''}
                                                onChange={(e) => updateTrendingProduct(index, 'customLink', e.target.value)}
                                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeTrendingProduct(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {settings.trendingProducts.length === 0 && (
                                <p className="text-gray-400 text-center py-6">
                                    No products added. Will show bestselling products by default.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Legal & Copyright Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-black mb-6">Legal & Copyright</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                                <input
                                    type="text"
                                    value={settings.copyrightText}
                                    onChange={(e) => setSettings(prev => ({ ...prev, copyrightText: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="© 2025 The Archive. All rights reserved."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.showPrivacyLink}
                                            onChange={(e) => setSettings(prev => ({ ...prev, showPrivacyLink: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Show Privacy Link</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.privacyUrl}
                                        onChange={(e) => setSettings(prev => ({ ...prev, privacyUrl: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="/privacy"
                                        disabled={!settings.showPrivacyLink}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.showTermsLink}
                                            onChange={(e) => setSettings(prev => ({ ...prev, showTermsLink: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Show Terms Link</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.termsUrl}
                                        onChange={(e) => setSettings(prev => ({ ...prev, termsUrl: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="/terms"
                                        disabled={!settings.showTermsLink}
                                    />
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
