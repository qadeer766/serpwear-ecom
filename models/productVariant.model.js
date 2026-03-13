// import mongoose from "mongoose";

// const productVariantSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//       index: true,
//     },

//     color: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     size: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     mrp: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     sellingPrice: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     discountPercentage: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 100,
//     },

//     sku: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     medias: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Media",
//         required: true,
//       },
//     ],

//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );


// productVariantSchema.index({ deletedAt: 1 });


// const ProductVariantModel =
//   mongoose.models.ProductVariant ||
//   mongoose.model("ProductVariant", productVariantSchema, "productvariants");

// export default ProductVariantModel;


import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // References the Product model
      required: true,
      index: true, // Ensures indexing for faster lookup
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Create indexes for `productId` and `sku` for faster querying

productVariantSchema.index({ deletedAt: 1 });

// Model creation (ensures it is created only once)
const ProductVariantModel =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", productVariantSchema, "productvariants");

export default ProductVariantModel;