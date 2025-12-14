const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  sessionId: String,
  paymentIntentId: String,
  customerEmail: String,
  customerName: String,

  // Shipping address from Stripe
  shipping: {
    name: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String
    }
  },

  items: [
    {
      name: String,
      quantity: Number,
      amount_total: Number,
      amount_subtotal: Number,
      priceId: String,
    }
  ],

  currency: String,
  amount_total: Number,
  amount_subtotal: Number,
  payment_status: String,

  payment_method: {
    brand: String,
    last4: String,
    exp_month: Number,
    exp_year: Number,
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
