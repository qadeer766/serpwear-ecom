import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";

export async function GET() {
  try {
    await connectDB();

    const categories = await CategoryModel.find({
      deletedAt: null,
    }).lean();

    if (!categories.length) {
      return response(false, 404, "No categories found.");
    }

    return response(true, 200, "Categories fetched.", categories);
  } catch (error) {
    return catchError(error);
  }
}