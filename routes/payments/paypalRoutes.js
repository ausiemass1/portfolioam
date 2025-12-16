const express = require('express');
const router = express.Router();
const paypalControllers = require('../../controllers/paypalControllers');

router.post('/pay', paypalControllers.paymentSuccess);
router.get('/success', paypalControllers.captureOrder);
router.get('/cancel', paypalControllers.payentCancel)

module.exports = router;
