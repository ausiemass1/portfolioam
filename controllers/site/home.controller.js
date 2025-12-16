const Products = require("../../models/productsModel");

exports.home = async (req, res) => {
    const products = await Products.find();
    res.render("pages/index", {
      title: "Home Page",
      products,
      user: req.user || null,
    });
  }