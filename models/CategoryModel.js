const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      default: ""
    },

    // e.g. Men, Women, Kids
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      default: "unisex"
    },

    // e.g. Sneakers, Boots, Sandals
    type: {
      type: String,
      enum: [
        "sneakers",
        "boots",
        "sandals",
        "heels",
        "formal",
        "sports",
        "slippers"
      ],
      required: true
    },

    image: {
      type: String,
      default: "/images/category-placeholder.png"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Prevent model overwrite
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
