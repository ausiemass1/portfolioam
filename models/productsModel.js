const mongoose = require('mongoose');

// Define product schema
const productSchema = new mongoose.Schema({
  product_name: String,
  price: String,
  image: String
});

// Prevent model overwrite if it’s already compiled
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);