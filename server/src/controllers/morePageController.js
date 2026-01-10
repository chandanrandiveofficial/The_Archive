import MorePage from '../models/MorePage.js';

// @desc    Get all more pages
// @route   GET /api/more
// @access  Public
export const getMorePages = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = status ? { status } : {};

    const pages = await MorePage.find(query)
      .sort({ order: 1, createdAt: -1 })
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single more page
// @route   GET /api/more/:id
// @access  Public
export const getMorePage = async (req, res, next) => {
  try {
    const page = await MorePage.findById(req.params.id).populate(
      'updatedBy',
      'name email'
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get more page by slug
// @route   GET /api/more/slug/:slug
// @access  Public
export const getMorePageBySlug = async (req, res, next) => {
  try {
    const page = await MorePage.findOne({ slug: req.params.slug }).populate(
      'updatedBy',
      'name email'
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create more page
// @route   POST /api/more
// @access  Private/Admin
export const createMorePage = async (req, res, next) => {
  try {
    console.log('Creating more page with body:', req.body);
    if (!req.user) {
      console.log('User not found in request');
      return res.status(401).json({
        success: false,
        message: 'User authentication failed'
      });
    }

    req.body.updatedBy = req.user._id || req.user.id;

    const page = await MorePage.create(req.body);
    console.log('Page created successfully:', page._id);

    res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error('Error in createMorePage:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Page with this slug/title already exists',
      });
    }
    // Return the error message and stack for debugging
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

// @desc    Update more page
// @route   PUT /api/more/:id
// @access  Private/Admin
export const updateMorePage = async (req, res, next) => {
  try {
    let page = await MorePage.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    req.body.updatedBy = req.user.id || req.user._id;

    page = await MorePage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete more page
// @route   DELETE /api/more/:id
// @access  Private/Admin
export const deleteMorePage = async (req, res, next) => {
  try {
    const page = await MorePage.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    await page.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder more pages
// @route   PUT /api/more/reorder
// @access  Private/Admin
export const reorderPages = async (req, res, next) => {
  try {
    const { pages } = req.body; // Array of { id, order }

    if (!Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        message: 'Pages must be an array',
      });
    }

    // Update all pages with new order
    const updatePromises = pages.map((item) =>
      MorePage.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Pages reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
