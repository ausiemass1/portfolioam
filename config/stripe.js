import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // loging in to stripe

export default stripe; // making stripe usable in all other files
