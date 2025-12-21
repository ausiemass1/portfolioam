import Product from '../../models/productsModel.js'
import redisClient from '../../config/redis.js';
// Add product to cart
const cartAdd = async (req, res) => {
    try {
      const { productId } = req.params;
      const sessionId = req.sessionID;
  
      const product = await Product.findById(productId);
      if (!product) return res.redirect("/products");
  
      const key = `cart:${sessionId}`;
  
      const cart = JSON.parse(await redisClient.get(key)) || {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };
  
      const item = cart.items.find(
        (i) => i.productId === productId
      );
  
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
  
      await redisClient.set(key, JSON.stringify(cart), {
        EX: 60 * 60 * 24,
      });
  
      res.redirect(req.get("Referer") || "/products");
    } catch (err) {
      console.error("Cart add error:", err);
      res.redirect("/products");
    }
  };
  
//view cart items
const cartDisplay = async (req, res) => {
  const key = `cart:${req.sessionID}`;
  const cart = JSON.parse(await redisClient.get(key));

  res.render("pages/cart", { cart });
};
// Decrement item quantity
const cartDecrement = async (req, res) => {
    try {
      const { productId } = req.params;
      const key = `cart:${req.sessionID}`;
  
      const cart = JSON.parse(await redisClient.get(key));
      if (!cart) return res.redirect("/cart");
  
      const itemIndex = cart.items.findIndex(
        (i) => i.productId === productId
      );
  
      if (itemIndex === -1) return res.redirect("/cart");
  
      const item = cart.items[itemIndex];
  
      // Reduce totals
      cart.totalQuantity -= 1;
      cart.totalPrice -= item.price;
  
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // remove item if quantity reaches 0
        cart.items.splice(itemIndex, 1);
      }
  
      await redisClient.set(key, JSON.stringify(cart), {
        EX: 60 * 60 * 24,
      });
  
      res.redirect(req.get("Referer") || "/cart");
    } catch (err) {
      console.error("Cart decrement error:", err);
      res.redirect("/cart");
    }
  };

  
  

export default {
  cartAdd,
  cartDisplay,
  cartDecrement
};
