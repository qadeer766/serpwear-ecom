

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/product.model";
import { encode } from "entities";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    // Define schema for validation
    const schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors); // Provide more detailed error info
    }

    const data = validate.data;

    // Validate product ID format
    if (!isValidObjectId(data._id)) {
      return response(false, 400, "Invalid product ID.");
    }

    // Fetch the product from the database
    const product = await ProductModel.findOne({
      _id: data._id,
      deletedAt: null, // Ensure it is not soft-deleted
    });

    if (!product) {
      return response(false, 404, "Product not found.");
    }

    // Check if the slug already exists for another product
    const existingSlug = await ProductModel.findOne({
      slug: data.slug,
      _id: { $ne: data._id }, // Exclude current product
    });

    if (existingSlug) {
      return response(false, 400, "Slug already exists.");
    }

    // Calculate discount if not provided (ensure values are valid)
    let discount = 0;
    if (data.mrp > 0 && data.sellingPrice > 0) {
      discount = Math.round(((data.mrp - data.sellingPrice) / data.mrp) * 100);
    }

    // Update the product with the new data
    product.name = data.name;
    product.slug = data.slug;
    product.category = data.category;
    product.mrp = data.mrp;
    product.sellingPrice = data.sellingPrice;
    product.discountPercentage = discount;
    product.description = encode(data.description);
    product.media = data.media;

    // Save the updated product
    await product.save();

    return response(true, 200, "Product updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}