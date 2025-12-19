import axios from "axios";

// step 1 : generate accessToken
async function getAccessToken() {
  const response = await axios({
    url: `${process.env.BASE_URL}/v1/oauth2/token`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
      ).toString("base64")}`,
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
}

// STEP 2: Create PayPal Order
async function createOrder() {
  const accessToken = await getAccessToken();

  const response = await axios({
    url: `${process.env.BASE_URL}/v2/checkout/orders`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: JSON.stringify({
      intent: "CAPTURE",

      purchase_units: [
        {
          items: [
            {
              name: "NodeJS Course",
              description: "Online course",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: "20.00",
              },
            },
          ],
          amount: {
            currency_code: "USD", // MUST match items[].unit_amount
            value: "20.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "20.00",
              },
            },
          },
        },
      ],

      application_context: {
        return_url: process.env.RETURN_URL,
        cancel_url: process.env.CANCEL_URL,
        brand_name: "MongoDB Store",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  return response.data.links.find((links) => links.rel === "approve").href;
}

// step 3: capture paypal order order
async function capturePayment(orderID) {
  const accessToken = await getAccessToken();
  const response = await axios({
    url: process.env.BASE_URL + `/v2/checkout/orders/${orderID}/capture`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export default {
  getAccessToken,
  createOrder,
  capturePayment,
};
