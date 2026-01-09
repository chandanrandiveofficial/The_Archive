import mongoose from 'mongoose';

const footerLinkSchema = new mongoose.Schema({
    label: { type: String, required: true },
    url: { type: String, required: true },
    isExternal: { type: Boolean, default: false }
});

const trendingProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    customImage: String,
    customLink: String
});

const footerSettingsSchema = new mongoose.Schema(
    {
        editorsPick: [footerLinkSchema],
        moreLinks: [footerLinkSchema],
        trendingProducts: [trendingProductSchema],
        copyrightText: {
            type: String,
            default: '© 2025 The Archive. All rights reserved.'
        },
        showPrivacyLink: { type: Boolean, default: true },
        showTermsLink: { type: Boolean, default: true },
        privacyUrl: { type: String, default: '/privacy' },
        termsUrl: { type: String, default: '/terms' }
    },
    {
        timestamps: true
    }
);

const FooterSettings = mongoose.model('FooterSettings', footerSettingsSchema);

export default FooterSettings;
