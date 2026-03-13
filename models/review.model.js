import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    review: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate reviews (active only)
reviewSchema.index(
  { productId: 1, userId: 1 },
  { unique: true }
);

const ReviewModel =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema, "reviews");

export default ReviewModel;