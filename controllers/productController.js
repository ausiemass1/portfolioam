const Product = require('../models/productsModel')
// add product to database (Create an entry)
exports.addProduct = async (req, res) => {
  try {
    const { product_name, price } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    await Product.create({
      product_name,
      price,
      image: imagePath
    });

    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
};
// display all products  (Read from Database)
exports.displayProducts = async (req, res) => {
  try {
    const products = await Product.find(); // find all products

    res.render("pages/Product", { 
      title: "product", 
      products,
      user: req.user  
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving products");
  }
};
 
// Show edit product form (Update)
exports.editProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.render('pages/editProduct', { 
      title: "Edit Product", 
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

// Update product  (Update )
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const { product_name, price } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = { product_name, price };

    if (imagePath) {
      updateData.image = imagePath;
    }

    await Product.findByIdAndUpdate(id, updateData);

    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
};

// delete a product  (Delete)
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;  // Get the product ID from the URL
    await Product.findByIdAndDelete(productId); // Delete the product from the DB

    res.redirect('/products'); // After deleting, go back to the product list page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting product');
  }
};
