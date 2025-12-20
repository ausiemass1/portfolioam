import express from 'express';

const router = express.Router();
import paypalControllers from '../../controllers/payments/paypal.controllers.js';

router.post('/pay', paypalControllers.paymentSuccess);
router.get('/success', paypalControllers.captureOrder);
router.get('/cancel', paypalControllers.paymentCancel)

export default router;
