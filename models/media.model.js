import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    asset_id: {
      type: String,
      required: true,
      index: true, // if you want index here
    },

    public_id: {
      type: String,
      required: true,
      unique: true, // ✅ This already creates index
    },

    secure_url: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    width: {
      type: Number,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },

    format: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    resource_type: {
      type: String,
      default: "image",
      enum: ["image", "video", "raw"],
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const MediaModel =
  mongoose.models.Media ||
  mongoose.model("Media", mediaSchema, "media");

export default MediaModel;