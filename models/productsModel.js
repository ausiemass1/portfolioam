const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false
  },

  name: String,
  description: String,
  price: Number,

  images: {
    type: [String],
    default: []
  },

  sizes: {
    type: [
      {
        label: String,
        value: String
      }
    ],
    default: []
  }
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
