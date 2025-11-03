import Product from "../../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

// 🔧 Helper: upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "megamart/products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

// --------------------------------------
// GET /api/products
// Supports: search, filter, pagination
// --------------------------------------
export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      page = 1,
      limit = 200,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    const query = {};

    // 🔍 Keyword search
    if (keyword) {
      const regex = new RegExp(keyword.trim(), "i");
      query.$or = [
        { "name.en": regex },
        { "name.ar": regex },
        { "description.en": regex },
        { "description.ar": regex },
        { "category.en": regex },
        { "category.ar": regex },
      ];
    }

    // 🏷 Category filter
    if (category) {
      const [lang, value] = category.split(":");
      if (lang && value) query[`category.${lang}`] = value;
    }

    // 💰 Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 📦 Pagination
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// --------------------------------------
// POST /api/products
// Supports multipart/form-data (images)
// --------------------------------------
export const createProduct = async (req, res) => {
  try {
    const body = JSON.parse(req.body.data || "{}");
    let uploadedImages = [];

    if (req.files?.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return { url: result.secure_url, public_id: result.public_id };
      });
      uploadedImages = await Promise.all(uploadPromises);
    }

    const product = new Product({
      ...body,
      images: uploadedImages,
      mainImage: uploadedImages[0] || {},
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// --------------------------------------
// --------------------------------------
// PUT /api/products/:id
// --------------------------------------
export const updateProduct = async (req, res) => {
  try {
    // Detect if request is JSON (no file uploads)
    if (req.is("application/json")) {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated)
        return res.status(404).json({ message: "Product not found" });
      return res.json(updated);
    }

    // Handle multipart/form-data (with optional images)
    const updatedData = { ...req.body };

    // ✅ Convert stringified JSON fields if present (Next.js often stringifies objects in FormData)
    ["name", "description", "category"].forEach((field) => {
      if (updatedData[field] && typeof updatedData[field] === "string") {
        try {
          updatedData[field] = JSON.parse(updatedData[field]);
        } catch {
          /* ignore if not valid JSON */
        }
      }
    });

    // ✅ Handle new image uploads (if any)
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return { url: result.secure_url, public_id: result.public_id };
      });
      updatedData.images = await Promise.all(uploadPromises);

      // Automatically set mainImage to first uploaded image (if not already)
      if (updatedData.images.length > 0) {
        updatedData.mainImage = updatedData.images[0];
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};


// --------------------------------------
// DELETE /api/products/:id
// --------------------------------------
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 🧹 Delete Cloudinary images
    for (const img of product.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// --------------------------------------
// GET /api/products/:id
// --------------------------------------
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};
