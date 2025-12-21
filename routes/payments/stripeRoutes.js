import express from "express";
import stripe from "../../config/stripe.js";
import stripeController from "../../controllers/payments/stripe.controller.js";

const router = express.Router();

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

router.get("/checkout", stripeController.stripeCheckoutRedis);
router.post("/checkout", stripeController.stripeCheckoutRedis);
router.get("/success", stripeController.stripeSuccess);
router.get("/cancel", stripeController.stripeCancel);
router.post("/webhook", express.raw({type: 'application/json'}), stripeController.stripeWebhook);

export default router;
