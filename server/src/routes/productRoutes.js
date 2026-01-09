import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductTimeline,
  getProductStats,
  getRelatedProducts,
  getBestsellers,
  getEditorsPick,
  getMonthlyCollections,
  getYearlyCollections,
  getHomepageData,
  updateProductVisibility,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn([
      'Furniture',
      'Accessories', 
      'Arts',
      'Apps',
      'Agriculture',
      'Automative and Industrial',
      'Baby, Kids & Parenting',
      'Beauty, Personal Care & Wellness',
      'B2B, Industrial & Manufacturing',
      'D2C Brands & Consumer Products',
      'Fashion, Apparel & Accessories',
      'Entertainment',
      'Education, Learning & EdTech',
      'Electric Vehicles, Mobility & Transport',
      'Food, Beverage & FMCG',
      'Health, Fitness & Medical',
      'Home, Kitchen & Lifestyle',
      'Services & Marketplaces',
      'Sustainability & Green Products',
      'Sports & Outdoor',
      'Gift',
      'Tech & Electronics',
      'Miscellaneous',
      'Lighting',
      'Decor'
    ])
    .withMessage('Invalid category'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('year')
    .isInt({ min: 1950, max: new Date().getFullYear() + 10 })
    .withMessage('Invalid year'),
  body('month')
    .isIn([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ])
    .withMessage('Invalid month'),
];

// Public routes
router.get('/', getProducts);
router.get('/timeline', getProductTimeline);
router.get('/featured/homepage', getHomepageData);
router.get('/featured/bestsellers', getBestsellers);
router.get('/featured/editorspick', getEditorsPick);
router.get('/featured/monthly', getMonthlyCollections);
router.get('/featured/yearly', getYearlyCollections);
router.get('/stats/summary', protect, admin, getProductStats);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Protected admin routes
router.post('/', protect, admin, productValidation, validate, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.patch('/:id/visibility', protect, admin, updateProductVisibility);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
