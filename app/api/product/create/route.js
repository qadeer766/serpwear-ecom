

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/product.model";
import CategoryModel from "@/models/category.model";
import { encode } from "entities";

export async function POST(request) {
  try {
    /* ================= AUTH ================= */
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    /* ================= PARSE BODY ================= */
    const payload = await request.json();

    // Validate fields using Zod schema
    const schema = zSchema.pick({
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
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const {
      name,
      slug,
      category,
      mrp,
      sellingPrice,
      discountPercentage,
      description,
      media,
    } = validate.data;

    /* ================= VALIDATIONS ================= */

    // Check for duplicate slug
    const existingProduct = await ProductModel.findOne({ slug });
    if (existingProduct) {
      return response(false, 400, "Slug already exists.");
    }

    // Validate category exists and is not deleted
    const categoryExists = await CategoryModel.findOne({
      _id: category,
      deletedAt: null, // Ensure it's not soft-deleted
    });

    if (!categoryExists) {
      return response(false, 400, "Invalid or deleted category.");
    }

    // Ensure pricing values are valid
    const mrpNumber = Number(mrp);
    const spNumber = Number(sellingPrice);

    if (mrpNumber <= 0 || spNumber <= 0) {
      return response(false, 400, "Invalid pricing values.");
    }

    // Auto-calculated discount if not provided
    const calculatedDiscount =
      discountPercentage ??
      Math.round(((mrpNumber - spNumber) / mrpNumber) * 100);

    // Validate media: product must have at least one image
    if (!Array.isArray(media) || media.length === 0) {
      return response(false, 400, "Product must have at least one image.");
    }

    /* ================= CREATE PRODUCT ================= */
    const newProduct = await ProductModel.create({
      name,
      slug,
      category,
      mrp: mrpNumber,
      sellingPrice: spNumber,
      discountPercentage: calculatedDiscount,
      description: description ? encode(description) : "",
      media,
    });

    return response(true, 200, "Product added successfully.", newProduct);
  } catch (error) {
    return catchError(error);
  }
}