/* global Stripe, axios */

// 1. Initialize Stripe using your publishable key
const stripe = Stripe(
  "pk_test_51ScC5bDnJPMwVKZWDxXorPMWcikNffP8CN2NyDlBtfGdow60xWxkOow5Mv3i8nNDvkDJyYXorTgSEDefmgQbFXEb005SoTci04"
);

// 2. Create elements instance
const elements = stripe.elements();

// 3. Create the card input field
const cardElement = elements.create("card");

// 4. Mount card element into the HTML div
cardElement.mount("#card-element");

// -------------------------
// PAY NOW button handler
// -------------------------

document.getElementById("payNow").addEventListener("click", async () => {
  try {
    // 1️⃣ Create PaymentIntent on the server
    const res = await axios.post("/api/payments/create-payment-intent", {
      amount: 10000, // amount in cents ($100.00)
    });

    const clientSecret = res.data.clientSecret;

    if (!clientSecret) {
      console.error("No client secret returned from server");
      return alert("Payment cannot continue. Please try again.");
    }

    // 2️⃣ Confirm payment on the client side
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    // 3️⃣ Handle result
    if (result.error) {
      console.error(result.error.message);
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment succeeded!");
    } else {
      console.log(result);
      alert("Unexpected payment status. Please contact support.");
    }
  } catch (err) {
    // Better user message with helpful detail for devs
    const message =
      err?.response?.data?.error ||
      err?.message ||
      (typeof err === "string" ? err : "Unknown error");

    alert("Error: " + message);
  }
});
