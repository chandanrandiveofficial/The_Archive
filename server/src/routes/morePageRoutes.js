import express from 'express';
import {
  getMorePages,
  getMorePage,
  getMorePageBySlug,
  createMorePage,
  updateMorePage,
  deleteMorePage,
  reorderPages,
} from '../controllers/morePageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const morePageValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .withMessage('Invalid status'),
];

// Public routes
router.get('/', getMorePages);
router.get('/slug/:slug', getMorePageBySlug);
router.get('/:id', getMorePage);

// Protected admin routes
router.post('/', protect, admin, ...morePageValidation, validate, createMorePage);
router.put('/:id', protect, admin, updateMorePage);
router.delete('/:id', protect, admin, deleteMorePage);
router.put('/reorder/bulk', protect, admin, reorderPages);

export default router;
