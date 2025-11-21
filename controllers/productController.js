const Product = require('../models/productsModel')

// exports.addProduct = async (req, res) => {
//     try {
//         const { product_name, price, image } = req.body;

    

//         // Create new product document
//         const newProduct = new Product({
//             product_name,
//             price,
//             image,
          
//         });

//         await newProduct.save();

//         //res.send("product added successfully!");
//         res.redirect('../product');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Product not added");
//     }
// };

exports.addProduct = async (req, res) => {
  try {
    const { product_name, price } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    await Product.create({
      product_name,
      price,
      image: imagePath
    });

    res.send("Product added successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
};


exports.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;  // Get the product ID from the URL
      await Product.findByIdAndDelete(productId); // Delete the product from the DB
  
      res.redirect('/product/all'); // After deleting, go back to the product list page
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting product');
    }
  };
  
  // Show the edit form
  exports.editProductForm = async (req, res) => {
    try {
      const Product = await Product.findById(req.params.id);
      res.render('pages/update', { title: "Edit Product", Product });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading edit form");
    }
  };
  
  //Update the form
  exports.updateProduct = async (req, res) => {
    try {
      const id = req.params.id;
  
      await Product.findByIdAndUpdate(id, {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password
      });
  
      res.redirect('/product/all');
    } catch (err) {
      console.error(err);
      res.status(500).send("Update failed");
    }
  };

  exports.displayProducts = async (req,res) => {
    res.render("pages/product", { title: "product" });
  };