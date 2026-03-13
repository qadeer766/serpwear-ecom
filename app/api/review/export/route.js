import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/review.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const filter = { deletedAt: null };

    const reviews = await ReviewModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (reviews.length === 0) {
      return response(false, 404, "No reviews found.");
    }

    return response(true, 200, "Data found.", reviews);
  } catch (error) {
    return catchError(error);
  }
}