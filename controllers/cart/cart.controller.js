import Product from "../../models/productsModel.js";
import redisClient from "../../config/redis.js";

const emptyCart = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const parseCart = (cartRaw) => {
  if (!cartRaw) return structuredClone(emptyCart);
  return typeof cartRaw === "string" ? JSON.parse(cartRaw) : cartRaw;
};

// Add product to cart (AJAX-friendly)
const cartAdd = async (req, res) => {
  try {
    const { productId } = req.params;
    const sessionId = req.sessionID;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const key = `cart:${sessionId}`;

    let cart = await redisClient.get(key);

    if (!cart) {
      cart = {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/img/placeholder.png",
        quantity: 1,
      });
    }

    cart.totalQuantity += 1;
    cart.totalPrice += product.price;

    await redisClient.set(key, cart, {
      ex: 60 * 60 * 24,
    });

    // ✅ JSON response (NO redirect)
    res.json({
      success: true,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ success: false });
  }
};

//view cart items
const cartDisplay = async (req, res) => {
  const key = `cart:${req.sessionID}`;

  // ✅ 1️⃣ Get cart directly (NO JSON.parse)
  const cart = (await redisClient.get(key)) || {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  };

  res.render("pages/cart", { cart });
};

// Decrement item quantity
export const cartDecrement = async (req, res) => {
  try {
    const { productId } = req.params;
    const key = `cart:${req.sessionID}`;

    const cartRaw = await redisClient.get(key);
    const cart = parseCart(cartRaw);

    const item = cart.items.find((i) => i.productId === productId);
    if (!item) {
      return res.json({ success: false });
    }

    // Decrement
    item.quantity -= 1;
    cart.totalQuantity -= 1;
    cart.totalPrice -= item.price;

    // Remove if quantity hits 0
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    }

    // Safety clamps
    cart.totalQuantity = Math.max(0, cart.totalQuantity);
    cart.totalPrice = Math.max(0, cart.totalPrice);

    await redisClient.set(key, JSON.stringify(cart));

    res.json({
      success: true,
      item: item.quantity > 0 ? item : { productId, quantity: 0 },
      cart,
    });
  } catch (err) {
    console.error("cartDecrement error:", err);
    res.status(500).json({ success: false });
  }
};

// Remove item entirely
export const cartRemove = async (req, res) => {
  try {
    const { productId } = req.params;
    const key = `cart:${req.sessionID}`;

    const cartRaw = await redisClient.get(key);
    const cart = parseCart(cartRaw);

    const item = cart.items.find((i) => i.productId === productId);
    if (!item) {
      return res.json({ success: false });
    }

    cart.totalQuantity -= item.quantity;
    cart.totalPrice -= item.price * item.quantity;

    cart.items = cart.items.filter((i) => i.productId !== productId);

    // Safety clamps
    cart.totalQuantity = Math.max(0, cart.totalQuantity);
    cart.totalPrice = Math.max(0, cart.totalPrice);

    await redisClient.set(key, JSON.stringify(cart));

    res.json({
      success: true,
      item: null,
      cart,
    });
  } catch (err) {
    console.error("cartRemove error:", err);
    res.status(500).json({ success: false });
  }
};

//Clear the cart
const clearCart = async (req, res) => {
  try {
    const key = `cart:${req.sessionID}`;

    await redisClient.set(
      key,
      {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      },
      {
        ex: 60 * 60 * 24, // 24 hours
      }
    );

    res.redirect("/cart");
  } catch (err) {
    console.error("Clear cart error:", err);
    res.redirect("/cart");
  }
};

// controllers/cart.controller.js
export const incrementCartItemAjax = async (req, res) => {
  try {
    const key = `cart:${req.sessionID}`;
    const { productId } = req.params;

    const cartRaw = await redisClient.get(key);

    const cart =
      typeof cartRaw === "string"
        ? JSON.parse(cartRaw)
        : cartRaw || {
            items: [],
            totalQuantity: 0,
            totalPrice: 0,
          };

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity += 1;
    cart.totalQuantity += 1;
    cart.totalPrice += item.price;

    await redisClient.set(key, JSON.stringify(cart));

    res.json({
      success: true,
      item,
      cart,
    });
  } catch (err) {
    console.error("Increment error:", err);
    res.status(500).json({ success: false });
  }
};

export default {
  cartAdd,
  cartDisplay,
  cartDecrement,
  cartRemove,
  clearCart,
  incrementCartItemAjax,
};
