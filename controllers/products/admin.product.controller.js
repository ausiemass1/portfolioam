import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import  path from "path";
import  crypto from "crypto";
import  Product from "../../models/productsModel.js";
import  Category from "../../models/CategoryModel.js";
import  Size from "../../models/sizesModel.js";

// authenticating with S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
//get product add form

const addProductform = async (req, res) => {
  try {
    
    const categories = await Category.find();
    const sizes = await Size.find();
    res.render('admin/products/add', { 
      title: "Add Product", 
      categories,
      sizes,
      layout: 'admin/layout'

    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
}

// uploading product to s3
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category
    } = req.body;

    // sizes can be string (1 checkbox) or array (many)
    let sizes = req.body.sizes || [];
    if (!Array.isArray(sizes)) {
      sizes = [sizes];
    }

    const imageUrls = [];

    // Upload multiple images to S3
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `products/${crypto
          .randomBytes(16)
          .toString("hex")}${path.extname(file.originalname)}`;

        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype
        };

        await s3.send(new PutObjectCommand(params));

        imageUrls.push(
          `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
        );
      }
    }

    await Product.create({
      name,
      description,
      price,
      category,
      sizes,
      images: imageUrls
    });

    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(500).send("Error adding product");
  }
};

// display all products  (Read from Database)
const displayProducts = async (req, res) => {
  try {
    const products = await Product
    .find()
    .populate("category");

    res.render("admin/products/list", { 
      title: "product", 
      products,
      user: req.user,
      layout: 'admin/layout'
 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving products");
  }
};
 
// Show edit product form (Update)
const editProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find(); 
    const sizes = await Size.find(); 
    res.render('admin/products/edit', { 
      title: "edit Product", 
      sizes,
      categories,
      product,
      layout: 'admin/layout',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

// Update product  (Update )
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category
    } = req.body;

    // sizes can be string (1 checkbox) or array (many)
    let sizes = req.body.sizes || [];
    if (!Array.isArray(sizes)) {
      sizes = [sizes];
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const imageUrls = [];

    // Upload new images to S3 ONLY if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `products/${crypto
          .randomBytes(16)
          .toString("hex")}${path.extname(file.originalname)}`;

        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype
        };

        await s3.send(new PutObjectCommand(params));

        imageUrls.push(
          `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
        );
      }

      // Replace images only if new ones uploaded
      product.images = imageUrls;
    }

    // Update scalar fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.sizes = sizes;

    await product.save();

    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};


// delete a product  (Delete)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;  // Get the product ID from the URL
    await Product.findByIdAndDelete(productId); // Delete the product from the DB

    res.redirect('/admin/products'); // After deleting, go back to the product list page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting product');
  }
};

export default {
  addProduct,
  addProductform,
  displayProducts,
  editProductForm,
  updateProduct,
  deleteProduct,
}