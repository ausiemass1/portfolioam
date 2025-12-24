import Product from "../../models/productsModel.js";
import redisClient from "../../config/redis.js";
// Add product to cart
// const cartAdd = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const sessionId = req.sessionID;

//     const product = await Product.findById(productId);
//     if (!product) return res.redirect("/products");

//     const key = `cart:${sessionId}`;

//     const cart = JSON.parse(await redisClient.get(key)) || {
//       items: [],
//       totalQuantity: 0,
//       totalPrice: 0,
//     };

//     const item = cart.items.find((i) => i.productId === productId);

//     if (item) {
//       item.quantity += 1;
//     } else {
//       cart.items.push({
//         productId,
//         name: product.name,
//         price: product.price,
//         image: product.images?.[0] || "/img/placeholder.png",
//         quantity: 1,
//       });
//     }

//     cart.totalQuantity += 1;
//     cart.totalPrice += product.price;

//     await redisClient.set(key, JSON.stringify(cart), {
//       EX: 60 * 60 * 24,
//     });

//     res.redirect(req.get("Referer") || "/products");
//   } catch (err) {
//     console.error("Cart add error:", err);
//     res.redirect("/products");
//   }
// };

// Add product to cart
const cartAdd = async (req, res) => {
  try {
    const { productId } = req.params;
    const sessionId = req.sessionID;

    const product = await Product.findById(productId);
    if (!product) return res.redirect("/products");

    const key = `cart:${sessionId}`;

    // 1️⃣ GET cart from Upstash (returns object or null)
    let cart = await redisClient.get(key);

    // 2️⃣ Initialise if missing
    if (!cart) {
      cart = {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };
    }

    // 3️⃣ Find existing item
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

    // 4️⃣ Update totals
    cart.totalQuantity += 1;
    cart.totalPrice += product.price;

    // 5️⃣ SAVE cart back to Redis (NO stringify)
    await redisClient.set(key, cart, {
      ex: 60 * 60 * 24, // 24 hours
    });

    res.redirect(req.get("Referer") || "/products");
  } catch (err) {
    console.error("Cart add error:", err);
    res.redirect("/products");
  }
};

//view cart items
// const cartDisplay = async (req, res) => {
//   const key = `cart:${req.sessionID}`;
//   const cartData = JSON.parse(await redisClient.get(key));
//   const cart = cartData
//   ? JSON.parse(cartData)
//   : {
//       items: [],
//       totalQuantity: 0,
//       totalPrice: 0
//     };

//   res.render("pages/cart", { cart });
// };

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
const cartDecrement = async (req, res) => {
  try {
    const { productId } = req.params;
    const key = `cart:${req.sessionID}`;

    // 1️⃣ GET cart (Upstash returns object)
    const cart = await redisClient.get(key);
    if (!cart) return res.redirect("/cart");

    // 2️⃣ Find item safely
    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1) return res.redirect("/cart");

    const item = cart.items[itemIndex];

    // 3️⃣ Update totals
    cart.totalQuantity -= 1;
    cart.totalPrice -= item.price;

    // 4️⃣ Update item quantity or remove
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    // 5️⃣ SAVE cart (NO JSON.stringify, lowercase ex)
    await redisClient.set(key, cart, {
      ex: 60 * 60 * 24, // 24 hours
    });

    res.redirect(req.get("Referer") || "/cart");
  } catch (err) {
    console.error("Cart decrement error:", err);
    res.redirect("/cart");
  }
};

// Remove item entirely
const cartRemove = async (req, res) => {
  try {
    const { productId } = req.params;
    const key = `cart:${req.sessionID}`;

    // 1️⃣ Get cart
    const cart = await redisClient.get(key);
    if (!cart) return res.redirect("/cart");

    // 2️⃣ Find item safely
    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1) return res.redirect("/cart");

    const item = cart.items[itemIndex];

    // 3️⃣ Update totals
    cart.totalQuantity -= item.quantity;
    cart.totalPrice -= item.price * item.quantity;

    // 4️⃣ Remove item
    cart.items.splice(itemIndex, 1);

    // 5️⃣ Save cart (Upstash style)
    await redisClient.set(key, cart, {
      ex: 60 * 60 * 24, // 24 hours
    });

    res.redirect(req.get("Referer") || "/cart");
  } catch (err) {
    console.error("Cart remove error:", err);
    res.redirect("/cart");
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

    const item = cart.items.find(i => i.productId === productId);

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
