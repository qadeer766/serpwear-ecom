

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/productVariant.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();
    console.log("PAYLOAD:", payload);

    const schema = zSchema.pick({
      _id: true,
      sku: true,
      product: true, 
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true, // ✅ FIXED
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const data = validate.data;

    if (!isValidObjectId(data._id)) {
      return response(false, 400, "Invalid object id.");
    }

    const variant = await ProductVariantModel.findOne({
      _id: data._id,
      deletedAt: null,
    });

    if (!variant) {
      return response(false, 404, "Product variant not found.");
    }

    // ✅ Correct assignments (match model fields)
  variant.productId = data.product;
    variant.sku = data.sku;
    variant.color = data.color;
    variant.size = data.size;
    variant.mrp = Number(data.mrp);
    variant.sellingPrice = Number(data.sellingPrice);
    variant.discountPercentage = Number(data.discountPercentage);
    variant.media = data.media;

    await variant.save();

    return response(true, 200, "Product variant updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
