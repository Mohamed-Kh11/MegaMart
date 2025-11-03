import mongoose from "mongoose";

// --- Review sub-schema ---
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: {
      en: { type: String },
      ar: { type: String },
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: {
      en: { type: String },
      ar: { type: String },
    },
  },
  { timestamps: true }
);

// --- Product schema ---
const productSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    category: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    price: { type: Number, required: true, min: 0 },
    brand: { type: String, default: "Generic" },

    // --- Optional product variants ---
    colors: [{ type: String, trim: true }], // e.g. ["Black", "White", "Blue"]
    storage: [{ type: String, trim: true }], // e.g. ["128GB", "256GB"]
    sizes: [{ type: String, trim: true }], // e.g. ["S", "M", "L", "XL"]

    // --- Main image (featured) ---
    mainImage: {
      url: { type: String },
      public_id: { type: String },
    },

    // --- Additional images gallery ---
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],

    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 }, // e.g. 10 = 10%
  },
  { timestamps: true }
);

// --- Text index for multilingual search ---
productSchema.index({
  "name.en": "text",
  "name.ar": "text",
  "category.en": "text",
  "category.ar": "text",
});

const Product = mongoose.model("Product", productSchema);
export default Product;
