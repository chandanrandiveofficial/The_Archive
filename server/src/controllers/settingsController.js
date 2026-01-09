import FooterSettings from '../models/FooterSettings.js';
import Product from '../models/Product.js';

// @desc    Get footer settings
// @route   GET /api/settings/footer
// @access  Public
export const getFooterSettings = async (req, res, next) => {
    try {
        let settings = await FooterSettings.findOne()
            .populate('trendingProducts.productId', 'name images _id');

        // If no settings exist, create default ones
        if (!settings) {
            settings = await FooterSettings.create({
                editorsPick: [
                    { label: 'Design Systems 2024', url: '/editorspick', isExternal: false },
                    { label: 'Minimalist Architecture', url: '/editorspick', isExternal: false },
                    { label: 'Sustainable Materials', url: '/editorspick', isExternal: false },
                    { label: 'Digital Crafts', url: '/editorspick', isExternal: false }
                ],
                moreLinks: [
                    { label: 'About The Archive', url: '/more', isExternal: false },
                    { label: 'Submit a Product', url: '/submit', isExternal: false },
                    { label: 'Newsletter', url: '/newsletter', isExternal: false },
                    { label: 'Contact', url: '/contact', isExternal: false }
                ],
                trendingProducts: [],
                copyrightText: '© 2025 The Archive. All rights reserved.'
            });
        }

        // Get trending products from database if not set
        let trendingData = [];
        if (settings.trendingProducts && settings.trendingProducts.length > 0) {
            // Get the product IDs and verify they are still active
            const productIds = settings.trendingProducts
                .filter(tp => tp.productId)
                .map(tp => tp.productId._id || tp.productId);

            const activeProducts = await Product.find({
                _id: { $in: productIds },
                status: 'Active'
            }).select('name images _id');

            const activeProductMap = new Map(activeProducts.map(p => [p._id.toString(), p]));

            trendingData = settings.trendingProducts
                .filter(tp => {
                    const prodId = tp.productId?._id?.toString() || tp.productId?.toString();
                    return !prodId || activeProductMap.has(prodId);
                })
                .map(tp => {
                    const prodId = tp.productId?._id?.toString() || tp.productId?.toString();
                    const activeProduct = prodId ? activeProductMap.get(prodId) : null;
                    return {
                        productId: activeProduct?._id || null,
                        name: activeProduct?.name || 'Product',
                        image: tp.customImage || (activeProduct?.images?.[0]?.url) || '/hero.png',
                        link: tp.customLink || (activeProduct ? `/product/${activeProduct._id}` : '#')
                    };
                })
                .filter(tp => tp.productId || tp.customLink); // Only include valid products
        } else {
            // Fallback to bestselling products
            const products = await Product.find({
                status: 'Active',
                'visibility.bestSelling': true
            }).limit(3);

            trendingData = products.map(p => ({
                productId: p._id,
                name: p.name,
                image: p.images?.[0]?.url || '/hero.png',
                link: `/product/${p._id}`
            }));
        }

        res.status(200).json({
            success: true,
            data: {
                editorsPick: settings.editorsPick,
                moreLinks: settings.moreLinks,
                trendingProducts: trendingData,
                copyrightText: settings.copyrightText,
                showPrivacyLink: settings.showPrivacyLink,
                showTermsLink: settings.showTermsLink,
                privacyUrl: settings.privacyUrl,
                termsUrl: settings.termsUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update footer settings
// @route   PUT /api/settings/footer
// @access  Private/Admin
export const updateFooterSettings = async (req, res, next) => {
    try {
        let settings = await FooterSettings.findOne();

        if (!settings) {
            settings = new FooterSettings(req.body);
            await settings.save();
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }

        res.status(200).json({
            success: true,
            data: settings,
            message: 'Footer settings updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all products for selection
// @route   GET /api/settings/products-list
// @access  Private/Admin
export const getProductsList = async (req, res, next) => {
    try {
        const products = await Product.find({ status: 'Active' })
            .select('name _id images category')
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            data: products.map(p => ({
                _id: p._id,
                name: p.name,
                category: p.category,
                image: p.images?.[0]?.url || '/hero.png'
            }))
        });
    } catch (error) {
        next(error);
    }
};
