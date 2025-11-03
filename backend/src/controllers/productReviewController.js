import Product from "../../models/Product.js";

// --------------------------------------
// POST /api/products/:id/reviews
// Add or update a review
// --------------------------------------
export const addOrUpdateReview = async (req, res) => {
  try {
    const { rating, commentEn, commentAr, nameEn, nameAr } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment.en = commentEn;
      existingReview.comment.ar = commentAr;
      existingReview.name.en = nameEn;
      existingReview.name.ar = nameAr;
    } else {
      // Add new review
      const review = {
        user: req.user.id,
        name: { en: nameEn, ar: nameAr },
        rating: Number(rating),
        comment: { en: commentEn, ar: commentAr },
      };
      product.reviews.push(review);
    }

    // Recalculate rating and numReviews
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added/updated", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};

// --------------------------------------
// DELETE /api/products/:id/reviews/:reviewId
// --------------------------------------
export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only review owner or admin can delete
    if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    // Recalculate rating and numReviews
    if (product.reviews.length > 0) {
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.numReviews = 0;
      product.rating = 0;
    }

    await product.save();
    res.json({ message: "Review deleted", product });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};
