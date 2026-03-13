import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import ProductModel from "@/models/product.model";
import MediaModel from "@/models/media.model";
export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const categorySlug = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit")) || 9;
    const page = parseInt(searchParams.get("page")) || 1;

    const skip = (page - 1) * limit;

     /* ================= CATEGORY FILTER ================= */

let query = { deletedAt: null };

if (categorySlug) {

  const decodedSlug = decodeURIComponent(categorySlug);

  const slugs = decodedSlug.split(",");

  const categories = await CategoryModel.find({
    slug: { $in: slugs },
    deletedAt: null
  }).select("_id");

  if (categories.length) {
    query.categoryId = {
      $in: categories.map(cat => cat._id)
    };
  }

}


    /* ================= PRODUCTS ================= */

    const products = await ProductModel.find(query)
      .populate("media")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return response(true, 200, "Products fetched successfully.", {
      products,
    });

  } catch (error) {
    return catchError(error);
  }
}