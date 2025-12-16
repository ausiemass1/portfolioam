const Product = require("../../models/productsModel");

// display all products  (Read from Database)
exports.displayProducts = async (req, res) => {
  try {
    const products = await Product.find();

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
