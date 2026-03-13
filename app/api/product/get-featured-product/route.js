import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model"

export async function GET() {
  try {
    await connectDB();

    // Only active products
    const products = await ProductModel.find({
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } },
      ],
    })
      .sort({ createdAt: -1 }) // latest first
      .populate("media", "_id secure_url")
      .limit(8)
      .lean();

    if (!products.length) {
      return response(false, 404, "No featured products found.");
    }

    return response(true, 200, "Featured products fetched.", products);
  } catch (error) {
    return catchError(error);
  }
}