import Product from'../models/productsModel.js';



const adminDashboard = async (req, res) => {
    try {
        const products = await Product.find(); // find all products
    
        res.render("admin/dashboard", { 
          title: "product", 
          products,
          user: req.user,
          layout: 'admin/layout',

            // Avoiding EJS from breaking
            search: req.query.search || "",
            category: req.query.category || "",
            selectedSize: req.query.size || "",
            minPrice: req.query.minPrice || "",
            maxPrice: req.query.maxPrice || "",

            // pass categories & sizes
            categories: [],
            sizes: [],
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving products");
      }
  };

export default {
  adminDashboard,
}