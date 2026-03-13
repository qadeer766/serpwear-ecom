import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
      trim: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  },
  { timestamps: true }
);

// ✅ TTL index (auto delete when expired)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Optional: prevent multiple active OTPs per email
otpSchema.index({ email: 1 });

const OTPModel =
  mongoose.models.OTP ||
  mongoose.model("OTP", otpSchema, "otps");

export default OTPModel;