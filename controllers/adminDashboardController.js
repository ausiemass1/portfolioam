const Product = require('../models/productsModel')



exports.adminDashboard = async (req, res) => {
    try {
        const products = await Product.find(); // find all products
    
        res.render("admin/dashboard", { 
          title: "product", 
          products,
          user: req.user,
          layout: 'admin/layout',

            // Add these so EJS never breaks
            search: req.query.search || "",
            category: req.query.category || "",
            selectedSize: req.query.size || "",
            minPrice: req.query.minPrice || "",
            maxPrice: req.query.maxPrice || "",

            // Later you will pass categories & sizes
            categories: [],
            sizes: [],
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving products");
      }
  };

