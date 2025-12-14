const stripe = require("../config/stripe");
const Order = require('../models/orderModel')
const endpointSecret = 'whsec_...';
exports.stripeCheckout = (req, res) => {
  res.render("pages/checkout", { title: "checkout" });
};


// creating a checkout session
exports.stripeCheckoutSessionCreate = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "node.js video",
            },
            unit_amount: 10 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ['NZ', 'US'], // adds shipping to new zealand and united states
      },
      success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_URL}/cancel`,
    });

    res.redirect(session.url);

  } catch (error) {
    console.log(error);
    res.status(500).send("Stripe session error");
  }
};


// stripe success route which also save to database
exports.stripeSuccess = async (req, res) => {
 
  try{
    const sessionID = req.query.session_id
    if(!sessionID){
      res.send('no session id')
    }

    const [session, lineItems] =  await Promise.all([
      stripe.checkout.sessions.retrieve(sessionID, {expand: ['payment_intent.payment_method']}),
      stripe.checkout.sessions.listLineItems(sessionID)
    ]);

   // preparing an order object to save to database
    const orderData = {
      sessionId: session.id,
      paymentIntentId: session.payment_intent.id,

      customerEmail: session.customer_details.email,
      customerName: session.customer_details.name,

      // shipping information
      shipping: {
        name: session.customer_details.name,
        phone: session.customer_details.phone,
        address: {
          line1: session.customer_details.address?.line1,
          line2: session.customer_details.address?.line2,
          city: session.customer_details.address?.city,
          state: session.customer_details.address?.state,
          postal_code: session.customer_details.address?.postal_code,
          country: session.customer_details.address?.country
        }
      },

      items: lineItems.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
        amount_subtotal: item.amount_subtotal,
        priceId: item.price.id
      })),

      currency: session.currency,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      payment_status: session.payment_status,

      payment_method: {
        brand: session.payment_intent.payment_method.card.brand,
        last4: session.payment_intent.payment_method.card.last4,
        exp_month: session.payment_intent.payment_method.card.exp_month,
        exp_year: session.payment_intent.payment_method.card.exp_year,
      }
    };

  // Save to MongoDB
  await Order.create(orderData);

  console.log("Order saved!");

  return res.redirect("/");

} catch (error) {
  console.error("Stripe success error:", error);
  return res.status(500).send("Something went wrong");
}
 
};

//Stripe cancel route, when the custoer decides to cancel the payment
exports.stripeCancel = (req,res) => {
  res.redirect('/checkout')
}

exports.stripeWebhook = (req, res) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}





