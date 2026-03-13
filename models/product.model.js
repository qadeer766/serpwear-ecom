

import mongoose from 'mongoose';
import slugify from 'slugify'; // For generating slugs automatically

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // This links to the Category model
      required: true,
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

    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],

    description: {
      type: String,
      required: true,
      trim: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre-save hook to automatically generate the slug for the product name
productSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true }); // Generate slug based on product name
  }
  next();
});

// Model creation (ensures the model is only created once)
const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;