

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/productVariant.model";
import ProductModel from "@/models/product.model";

export async function POST(request) {
  try {
    // Ensure the user is authenticated as an admin
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    // Connect to the database
    await connectDB();
    const payload = await request.json();
    console.log("PAYLOAD:", payload);

    // Define the validation schema
    const schema = zSchema.pick({
      sku: true,
      product: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
    });

    // Validate the payload
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const variantData = validate.data;

    // Ensure the associated product exists
    const productExists = await ProductModel.findById(variantData.product).lean();
    if (!productExists) {
      return response(false, 404, "Product not found.");
    }

    // Prevent duplicate SKU
    const existingSku = await ProductVariantModel.findOne({
      sku: variantData.sku,
      deletedAt: null,
    }).lean();
    if (existingSku) {
      return response(false, 400, "SKU already exists.");
    }

    // Ensure the media array is not empty and valid
    if (!Array.isArray(variantData.media) || variantData.media.length === 0) {
      return response(false, 400, "At least one image is required.");
    }

    // Create a new product variant
    const newProductVariant = new ProductVariantModel({
      productId: variantData.product,
      sku: variantData.sku,
      color: variantData.color,
      size: variantData.size,
      mrp: Number(variantData.mrp),
      sellingPrice: Number(variantData.sellingPrice),
      discountPercentage: Number(variantData.discountPercentage),
      media: variantData.media,
    });

    // Save the new product variant to the database
    await newProductVariant.save();

    return response(true, 200, "Product Variant added successfully.");
  } catch (error) {
    return catchError(error);
  }
}