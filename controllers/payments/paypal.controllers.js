import paypal from "../../helpers/paypal.js";

// initiating payment
const paymentSuccess = async (req, res) => {
  try {
    const url = await paypal.createOrder();
    res.redirect(url);
  } catch (error) {
    console.error("PayPal create order error:", error);
    return res.status(500).send("Failed to initiate payment");
  }
};

// capturing order
const captureOrder = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Missing PayPal token");
    }

    await paypal.capturePayment(token);

    // save order info to DB here, check and with stripe
    
    res.send("course purchased successfully");
  } catch (error) {
    console.error("PayPal capture error:", error);
    return res.status(500).send("Payment capture failed");
  }
};

// canceling payment
const paymentCancel = (req, res) => {
  res.redirect("/");
};

export default {
  paymentSuccess,
  paymentCancel,
  captureOrder,
}
