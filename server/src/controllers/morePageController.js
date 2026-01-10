import MorePage from '../models/MorePage.js';

// @desc    Get all more pages
// @route   GET /api/more
// @access  Public
export const getMorePages = async (req, res) => {
  const { status } = req.query;

  // If status is empty or not provided, return all pages (admin view)
  // Otherwise filter by status (public view defaults to PUBLISHED)
  const query = status ? { status } : {};

  const pages = await MorePage.find(query)
    .sort({ order: 1, createdAt: -1 })
    .populate('updatedBy', 'name email');

  res.status(200).json({
    success: true,
    count: pages.length,
    data: pages,
  });
};

// @desc    Get single more page
// @route   GET /api/more/:id
// @access  Public
export const getMorePage = async (req, res) => {
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
};

// @desc    Get more page by slug
// @route   GET /api/more/slug/:slug
// @access  Public
export const getMorePageBySlug = async (req, res) => {
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
};

// @desc    Create more page
// @route   POST /api/more
// @access  Private/Admin
export const createMorePage = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User authentication failed'
    });
  }

  req.body.updatedBy = req.user.id || req.user._id;

  const page = await MorePage.create(req.body);

  res.status(201).json({
    success: true,
    data: page,
  });
};

// @desc    Update more page
// @route   PUT /api/more/:id
// @access  Private/Admin
export const updateMorePage = async (req, res) => {
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
};

// @desc    Delete more page
// @route   DELETE /api/more/:id
// @access  Private/Admin
export const deleteMorePage = async (req, res) => {
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
};

// @desc    Reorder more pages
// @route   PUT /api/more/reorder
// @access  Private/Admin
export const reorderPages = async (req, res) => {
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
};
