


import mongoose from 'mongoose';
import slugify from 'slugify'; // To generate the slug automatically

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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

// Pre-save hook to auto-generate the slug from the category name
categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});



// Model creation (handling the case when the model is already defined)
const CategoryModel =
  mongoose.models.Category || mongoose.model('Category', categorySchema);

export default CategoryModel;