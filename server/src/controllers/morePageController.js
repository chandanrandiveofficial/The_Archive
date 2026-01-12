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
export const createMorePage = async (req, res) => {
  try {
    console.log('API: Creating more page', req.body.title);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { title, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const pageData = {
      title,
      content,
      status: status || 'DRAFT',
      updatedBy: req.user._id
    };

    const page = await MorePage.create(pageData);

    res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error('Error creating more page:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A page with this title/slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
