import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET() {
  try {
    await connectDB();

    const colors = await ProductVariantModel.distinct("color", {
      deletedAt: null,
    });

    if (!colors.length) {
      return response(false, 404, "No colors found.");
    }

    return response(true, 200, "Colors fetched successfully.", colors);
  } catch (error) {
    return catchError(error);
  }
}