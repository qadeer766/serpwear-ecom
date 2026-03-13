

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized access.");
    }

    const { id } = params;

    // Validate the object ID format
    if (!id || !isValidObjectId(id)) {
      return response(false, 400, "Invalid category ID format.");
    }

    await connectDB();

    // Find the category by ID that is not soft-deleted
    const category = await CategoryModel.findOne({
      _id: id,
      deletedAt: null, // Ensure it is not a soft-deleted category
    }).lean();

    if (!category) {
      return response(false, 404, "Category not found or has been deleted.");
    }

    return response(true, 200, "Category found successfully.", category);
  } catch (error) {
    return catchError(error);
  }
}