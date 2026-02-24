import { Router } from 'express';
import {
    updatePaymentSettings,
    getCreatorPendingPayments,
    confirmTransaction,
    getBrandPendingPayments,
    uploadPaymentProof,
    getCreatorPaymentInfo
} from '../controllers/payment.controller';

import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// ============================================
// Creator Routes
// ============================================

// Update payment settings (PromptPay/Bank)
router.post('/creator/payment-settings', authenticate, updatePaymentSettings);

// Get pending payments for creator
router.get('/creator/pending-payments', authenticate, getCreatorPendingPayments);

// Confirm payment receipt
router.post('/creator/transactions/:id/confirm', authenticate, confirmTransaction);

// ============================================
// Brand Routes
// ============================================

// Get pending payments for brand
router.get('/brand/pending-payments', authenticate, getBrandPendingPayments);

// Upload payment proof (slip)
router.post('/brand/transactions/:id/upload-proof', authenticate, uploadPaymentProof);

// Get creator payment info
router.get('/brand/creator/:id/payment-info', authenticate, getCreatorPaymentInfo);

export default router;
