import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    minShoppingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    validity: {
      type: Date,
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Explicit indexes (prevents duplicate index errors in dev)
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ deletedAt: 1 });

const CouponModel =
  mongoose.models.Coupon ||
  mongoose.model("Coupon", couponSchema, "coupons");

export default CouponModel;