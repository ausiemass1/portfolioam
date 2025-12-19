import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    label: {
      // What users see: "US 10", "EU 42", "Kids 3"
      type: String,
      required: true,
      trim: true
    },

    value: {
      // Used internally: "10", "42", "3"
      type: String,
      required: true
    },

    system: {
      // Sizing system
      type: String,
      enum: ["US", "EU", "UK"],
      required: true
    },

    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      default: "unisex"
    },

    // Useful for sorting sizes correctly
    order: {
      type: Number,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Prevent model overwrite
const Size =
  mongoose.models.Size || mongoose.model("Size", sizeSchema);

  export default Size;