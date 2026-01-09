import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Privacy = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPrivacyPage();
    }, []);

    const fetchPrivacyPage = async () => {
        try {
            setLoading(true);
            // Try to fetch by slug 'privacy-policy' or 'privacy'
            let response = await fetch(`${API_URL}/more/slug/privacy-policy`);
            let result = await response.json();

            if (!result.success) {
                // Try 'privacy' slug
                response = await fetch(`${API_URL}/more/slug/privacy`);
                result = await response.json();
            }

            if (result.success) {
                setPageData(result.data);
            } else {
                // Show default content if page not found
                setPageData({
                    title: 'Privacy Policy',
                    content: `This Privacy Policy describes how The Archive ("we", "us", or "our") collects, uses, and shares information about you when you use our website and services.

Information We Collect
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

Data Security
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

Your Rights
You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.

Contact Us
If you have any questions about this Privacy Policy, please contact us.

Last updated: January 2025`
                });
            }
        } catch (err) {
            setError('Failed to load privacy policy');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                {/* Page Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    {pageData?.title || 'Privacy Policy'}
                </h1>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    {pageData?.content.split('\n').map((paragraph, idx) => (
                        paragraph.trim() ? (
                            <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                                {paragraph}
                            </p>
                        ) : <br key={idx} />
                    ))}
                </div>

                {/* Meta */}
                {pageData?.updatedAt && (
                    <p className="text-gray-500 text-sm mt-12 pt-6 border-t border-gray-200">
                        Last updated: {new Date(pageData.updatedAt).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Privacy;
