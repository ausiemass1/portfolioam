const express = require("express");
const router = express.Router();
const stripe = require("../../config/stripe");
const stripePaymentsController = require('../../controllers/payments/stripe.payments.controller')
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).send({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).send({ error: err.message });
  }
});

router.get("/checkout", stripePaymentsController.stripeCheckout);
router.post("/checkout", stripePaymentsController.stripeCheckoutSessionCreate);
router.get("/success", stripePaymentsController.stripeSuccess);
router.get("/cancel", stripePaymentsController.stripeCancel);
router.post("/webhook", express.raw({type: 'application/json'}), stripePaymentsController.stripeWebhook);

module.exports = router;
