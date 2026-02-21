import express from 'express';
import { VerificationController } from '../controllers/verificationController.js';

const router = express.Router();

// Verify transfer
router.post('/verify', VerificationController.verifyTransfer);

// Get verification status
router.get('/verify/:roomId', VerificationController.getVerification);

// Get blockchain network info
router.get('/verify/network', VerificationController.getNetworkInfo);

export default router;
