import Product from "../../models/productsModel.js";

// display all products  (Read from Database)
const displayProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    res.render("pages/index", {
      title: "product",
      products,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving products");
  }
};

export default {
  displayProducts,
}
