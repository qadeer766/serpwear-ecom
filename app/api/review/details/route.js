import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return response(false, 400, "Valid productId is required.");
    }

    const objectId = new mongoose.Types.ObjectId(productId);

    const aggregation = await ReviewModel.aggregate([
      {
        $match: {
          productId: objectId,
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize structure
    const rating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const percentage = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let totalReview = 0;
    let ratingSum = 0;

    aggregation.forEach((item) => {
      const star = item._id;
      const count = item.count;

      rating[star] = count;
      totalReview += count;
      ratingSum += star * count;
    });

    const averageRating =
      totalReview > 0
        ? Number((ratingSum / totalReview).toFixed(1))
        : 0;

    if (totalReview > 0) {
      Object.keys(rating).forEach((key) => {
        percentage[key] = Number(
          ((rating[key] / totalReview) * 100).toFixed(1)
        );
      });
    }

    return response(true, 200, "Review details.", {
      totalReview,
      averageRating,
      rating,
      percentage,
    });
  } catch (error) {
    return catchError(error);
  }
}