const paypal = require("../../helpers/paypal");

// initiating payment
exports.paymentSuccess = async (req, res) => {
  try {
    const url = await paypal.createOrder();
    res.redirect(url);
  } catch (error) {
    console.log(error);
  }
};

// capturing order
exports.captureOrder = async (req, res) => {
  try {
    await paypal.capturePayment(req.query.token);
    res.send("course purchased successfully");
  } catch (error) {
    res.send("error" + error);
  }
};

// canceling payment
exports.payentCancel = (req, res) => {
  res.redirect("/");
};
