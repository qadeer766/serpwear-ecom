import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ReviewModel from "@/models/review.model";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const body = await request.json();

    const schema = zSchema.pick({
      product: true,
      rating: true,
      title: true,
      review: true,
    });

    const validate = schema.safeParse(body);

    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid or missing fields.",
        validate.error.errors
      );
    }

    const { product, rating, title, review } = validate.data;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return response(false, 400, "Invalid product ID.");
    }

    // ✅ Extra rating validation
    if (rating < 1 || rating > 5) {
      return response(false, 400, "Rating must be between 1 and 5.");
    }

    const userId = auth.userId;

    // ❌ Prevent duplicate review
    const existingReview = await ReviewModel.findOne({
      productId: product,
      userId,
      deletedAt: null,
    });

    if (existingReview) {
      return response(false, 400, "You already reviewed this product.");
    }

    const newReview = await ReviewModel.create({
      productId: product,
      userId,
      rating,
      title,
      review,
    });

    return response(
      true,
      201,
      "Your review submitted successfully.",
      newReview
    );
  } catch (error) {
    // ✅ Handle duplicate index error safely
    if (error.code === 11000) {
      return response(false, 400, "You already reviewed this product.");
    }

    return catchError(error);
  }
}