import stripe from "../../config/stripe.js";
import Order from"../../models/orderModel.js";

const stripeCheckout = (req, res) => {
  res.render("pages/checkout", { title: "checkout" });
};

// creating a checkout session
const stripeCheckoutSessionCreate = async (req, res) => {
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
        allowed_countries: ["NZ", "US"], // adds shipping to new zealand and united states
      },
      success_url: `${process.env.WEB_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_URL}/stripe/cancel`,
    });

    res.redirect(session.url);
  } catch (error) {
    console.log(error);
    res.status(500).send("Stripe session error");
  }
};

// stripe success route which also save to database
const stripeSuccess = async (req, res) => {
  res.redirect("/");
};

//Stripe cancel route, when the custoer decides to cancel the payment
const stripeCancel = (req, res) => {
  res.redirect("/checkout");
};

// stripe wbhook, this is where the order is saved to dataabase
const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // Fetch line items (not included by default)
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderData = {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,

        customerEmail: session.customer_details.email,
        customerName: session.customer_details.name,

        shipping: session.shipping_details
          ? {
              name: session.shipping_details.name,
              phone: session.shipping_details.phone,
              address: session.shipping_details.address,
            }
          : null,

        items: lineItems.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          amount_total: item.amount_total,
          amount_subtotal: item.amount_subtotal,
          priceId: item.price.id,
        })),

        currency: session.currency,
        amount_total: session.amount_total,
        amount_subtotal: session.amount_subtotal,
        payment_status: session.payment_status,
      };

      await Order.create(orderData);

      console.log("✅ Order saved from webhook:", session.id);
      break;
    }

    case "payment_intent.succeeded": {
      console.log(event.data);
      break;
    }

    // this is for creating payment intent (redirecting to stripe page)
    case "payment_intent.created": {
      console.log(event.data);
      break;
    }

    // this is for updaing the charge
    case "charge.updated":
      {
        console.log(event.data);
        break;
      }

      charge.updated;

    default:
      console.log(`Ignoring event type: ${event.type}`);
  }

  // ✅ Always acknowledge receipt
  res.sendStatus(200);
};

export default {
  stripeCheckout,
  stripeCheckoutSessionCreate,
  stripeCancel,
  stripeSuccess,
  stripeWebhook

}
