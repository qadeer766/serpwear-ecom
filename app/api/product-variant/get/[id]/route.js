import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";
import "@/models/media.model"; // ✅ ensure Media model registered
import { isValidObjectId } from "mongoose";

export async function GET(request, context) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    // ✅ Next 16 FIX
    const resolvedParams = await context.params;
    const id = resolvedParams.id;

    if (!id || !isValidObjectId(id)) {
      return response(false, 400, "Invalid object id.");
    }

    const variant = await ProductVariantModel.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate("productId", "_id name slug")
      .populate("media", "_id secure_url") // ✅ FIXED
      .lean();

    if (!variant) {
      return response(false, 404, "Product variant not found.");
    }

    return response(true, 200, "Product variant found.", variant);
  } catch (error) {
    return catchError(error);
  }
}