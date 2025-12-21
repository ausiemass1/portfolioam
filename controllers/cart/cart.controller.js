import Product from '../../models/productsModel.js'
import redisClient from '../../config/redis.js';
//Add product to cart
const cartAdd = async (req, res) => {
  const { productId } = req.params;
  const sessionId = req.sessionID;

  const product = await Product.findById(productId);
  if (!product) return res.redirect("/");

  const key = `cart:${sessionId}`;
  const cart = JSON.parse(await redisClient.get(key)) || {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  };

  const item = cart.items.find((i) => i.productId === productId);

  if (item) {
    item.quantity += 1;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
  }

  cart.totalQuantity += 1;
  cart.totalPrice += product.price;

  // Save with TTL (auto-expire after 24h)
  await redisClient.set(key, JSON.stringify(cart), {
    EX: 60 * 60 * 24,
  });
  console.log("Referer:", req.get("Referer"));

  // sending the user back to the products page to continue shopping
  const redirectTo = req.get("Referer") || "/";
  res.redirect(redirectTo);
};

//view cart items
const cartDisplay = async (req, res) => {
  const key = `cart:${req.sessionID}`;
  const cart = JSON.parse(await redisClient.get(key));

  res.render("pages/cart", { cart });
};

export default {
  cartAdd,
  cartDisplay,
};
