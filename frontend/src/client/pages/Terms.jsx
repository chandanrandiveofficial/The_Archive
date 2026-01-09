import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Terms = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTermsPage();
    }, []);

    const fetchTermsPage = async () => {
        try {
            setLoading(true);
            // Try to fetch by slug 'terms-of-service' or 'terms'
            let response = await fetch(`${API_URL}/more/slug/terms-of-service`);
            let result = await response.json();

            if (!result.success) {
                // Try 'terms' slug
                response = await fetch(`${API_URL}/more/slug/terms`);
                result = await response.json();
            }

            if (result.success) {
                setPageData(result.data);
            } else {
                // Show default content if page not found
                setPageData({
                    title: 'Terms of Service',
                    content: `Welcome to The Archive. By accessing or using our website and services, you agree to be bound by these Terms of Service.

Acceptance of Terms
By using our services, you agree to these terms. If you do not agree, please do not use our services.

Use of Services
You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates applicable laws or regulations.

Intellectual Property
All content on this website, including text, graphics, logos, and images, is the property of The Archive and is protected by copyright laws.

User Accounts
If you create an account, you are responsible for maintaining the confidentiality of your account information and for all activities under your account.

Product Information
We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, or error-free.

Limitation of Liability
The Archive shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.

Changes to Terms
We reserve the right to modify these terms at any time. Your continued use of our services after changes constitutes acceptance of the modified terms.

Contact Us
If you have any questions about these Terms of Service, please contact us.

Last updated: January 2025`
                });
            }
        } catch (err) {
            setError('Failed to load terms of service');
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
                    {pageData?.title || 'Terms of Service'}
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

export default Terms;
