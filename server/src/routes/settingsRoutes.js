import express from 'express';
import {
    getFooterSettings,
    updateFooterSettings,
    getProductsList
} from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/footer', getFooterSettings);

// Protected admin routes
router.put('/footer', protect, admin, updateFooterSettings);
router.get('/products-list', protect, admin, getProductsList);

export default router;
