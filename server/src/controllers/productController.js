import Product from '../models/Product.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      year,
      month,
      category,
      status,
      search,
      sortBy,
      page = 1,
      limit = 20,
      bestSelling,
      editorsPick,
    } = req.query;

    // Build query
    const query = {};

    if (year) query.year = parseInt(year);
    if (month) query.month = month;
    if (category) query.category = category;
    if (status) {
      query.status = status;
    } else {
      // Default to only showing Active products for public
      query.status = 'Active';
    }

    if (bestSelling) query['visibility.bestSelling'] = true;
    if (editorsPick) query['visibility.editorsPick'] = true;

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { year: -1, month: 1, createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products grouped by year and month
// @route   GET /api/products/timeline
// @access  Public
export const getProductTimeline = async (req, res, next) => {
  try {
    const { status = 'Active' } = req.query;

    const timeline = await Product.aggregate([
      { $match: { status } },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: 1 },
          products: { $push: '$$ROOT' },
        },
      },
      {
        $group: {
          _id: '$_id.year',
          total: { $sum: '$total' },
          months: {
            $push: {
              month: '$_id.month',
              total: '$total',
              products: '$products',
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists',
      });
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats/summary
// @access  Private/Admin
export const getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Product.countDocuments();
    const published = await Product.countDocuments({ status: 'Active' });
    const hidden = await Product.countDocuments({ status: 'Hidden' });

    res.status(200).json({
      success: true,
      data: {
        total,
        published,
        hidden,
        breakdown: stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { year: product.year }],
      status: 'Active',
    })
      .limit(4)
      .select('-__v');

    res.status(200).json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bestseller products
// @route   GET /api/products/featured/bestsellers
// @access  Public
export const getBestsellers = async (req, res, next) => {
  try {
    const { limit = 4 } = req.query;
    
    const products = await Product.find({
      status: 'Active',
      'visibility.bestSelling': true,
    })
      .sort({ views: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get editor's pick products
// @route   GET /api/products/featured/editorspick
// @access  Public
export const getEditorsPick = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({
      status: 'Active',
      'visibility.editorsPick': true,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await Product.countDocuments({
      status: 'Active',
      'visibility.editorsPick': true,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by month (last 2 months dynamically)
// @route   GET /api/products/featured/monthly
// @access  Public
export const getMonthlyCollections = async (req, res, next) => {
  try {
    const { limit = 4 } = req.query;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get current month and previous month
    const currentMonthName = months[currentMonth];
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthName = months[prevMonth];
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Fetch current month products
    const currentMonthProducts = await Product.find({
      status: 'Active',
      year: currentYear,
      month: currentMonthName,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');
    
    // Fetch previous month products
    const prevMonthProducts = await Product.find({
      status: 'Active',
      year: prevMonthYear,
      month: prevMonthName,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        currentMonth: {
          year: currentYear,
          month: currentMonthName,
          monthShort: currentMonthName.substring(0, 3).toUpperCase(),
          products: currentMonthProducts,
        },
        previousMonth: {
          year: prevMonthYear,
          month: prevMonthName,
          monthShort: prevMonthName.substring(0, 3).toUpperCase(),
          products: prevMonthProducts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products grouped by year
// @route   GET /api/products/featured/yearly
// @access  Public
export const getYearlyCollections = async (req, res, next) => {
  try {
    const { limit = 4 } = req.query;
    
    // Get distinct years
    const years = await Product.distinct('year', { status: 'Active' });
    years.sort((a, b) => b - a); // Sort descending
    
    const yearlyData = [];
    
    for (const year of years.slice(0, 5)) { // Limit to 5 years
      const products = await Product.find({
        status: 'Active',
        year: year,
      })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select('-__v');
      
      const total = await Product.countDocuments({
        status: 'Active',
        year: year,
      });
      
      yearlyData.push({
        year,
        total,
        products,
      });
    }

    res.status(200).json({
      success: true,
      data: yearlyData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get homepage data (all sections combined)
// @route   GET /api/products/featured/homepage
// @access  Public
export const getHomepageData = async (req, res, next) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthName = months[currentMonth];
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthName = months[prevMonth];
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Parallel fetch all data
    const [bestsellers, editorsPick, currentMonthProducts, prevMonthProducts, years] = await Promise.all([
      Product.find({ status: 'Active', 'visibility.bestSelling': true })
        .sort({ views: -1, createdAt: -1 })
        .limit(4)
        .select('-__v'),
      Product.find({ status: 'Active', 'visibility.editorsPick': true })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('-__v'),
      Product.find({ status: 'Active', year: currentYear, month: currentMonthName })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('-__v'),
      Product.find({ status: 'Active', year: prevMonthYear, month: prevMonthName })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('-__v'),
      Product.distinct('year', { status: 'Active' }),
    ]);
    
    // Get yearly collections
    years.sort((a, b) => b - a);
    const yearlyCollections = [];
    
    for (const year of years.slice(0, 3)) {
      if (year < currentYear) { // Exclude current year as it's shown in monthly
        const products = await Product.find({ status: 'Active', year })
          .sort({ createdAt: -1 })
          .limit(4)
          .select('-__v');
        
        yearlyCollections.push({ year, products });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        bestsellers,
        editorsPick,
        currentMonth: {
          year: currentYear,
          month: currentMonthName,
          monthShort: currentMonthName.substring(0, 3).toUpperCase(),
          products: currentMonthProducts,
        },
        previousMonth: {
          year: prevMonthYear,
          month: prevMonthName,
          monthShort: prevMonthName.substring(0, 3).toUpperCase(),
          products: prevMonthProducts,
        },
        yearlyCollections,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product visibility
// @route   PATCH /api/products/:id/visibility
// @access  Private/Admin
export const updateProductVisibility = async (req, res, next) => {
  try {
    const { bestSelling, editorsPick, published } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    if (typeof bestSelling === 'boolean') {
      product.visibility.bestSelling = bestSelling;
    }
    if (typeof editorsPick === 'boolean') {
      product.visibility.editorsPick = editorsPick;
    }
    if (typeof published === 'boolean') {
      product.visibility.published = published;
    }
    
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
