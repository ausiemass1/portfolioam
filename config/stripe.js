const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // loging in to stripe

module.exports = stripe; // making stripe usable in all other files
