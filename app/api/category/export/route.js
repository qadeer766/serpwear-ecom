

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";

export async function GET() {
  try {
    // 🔐 Check if the admin is authenticated
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    // Fetch categories that are not soft-deleted, sorted by createdAt in descending order
    const categories = await CategoryModel.find({
      deletedAt: null,
    })
      .sort({ createdAt: -1 }) // Sort by createdAt (latest first)
      .lean(); // Returns plain JavaScript objects instead of Mongoose documents

    // If no categories are found, return an empty array with a success message
    if (categories.length === 0) {
      return response(true, 200, "No categories found.", []); // Return empty array with success status
    }

    return response(true, 200, "Categories fetched successfully.", categories);
  } catch (error) {
    return catchError(error); // Ensure catchError handles different types of errors gracefully
  }
}