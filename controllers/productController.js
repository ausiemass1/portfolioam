const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const crypto = require("crypto");
const Product = require('../models/productsModel')


// authenticating with S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
//get product add form

exports.addProductform = (req, res) => {
  try {
    

    res.render('pages/addproduct', { 
      title: "Add Product", 

    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
}
// uploading product to s3
exports.addProduct = async (req, res) => {
  try {
    const { product_name, price } = req.body;

    let imageUrl = "";

    // If an image was uploaded
    if (req.file) {
      const fileName = `products/${crypto.randomBytes(16).toString("hex")}${path.extname(req.file.originalname)}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      // Public S3 URL
      imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    await Product.create({
      product_name,
      price,
      image: imageUrl
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error uploading to S3:", error);
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
