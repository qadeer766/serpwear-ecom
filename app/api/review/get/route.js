import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    let page = parseInt(searchParams.get("page")) || 1;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return response(false, 400, "Valid productId is required.");
    }

    if (page < 1) page = 1;

    const limit = 10;
    const skip = (page - 1) * limit;

    const objectId = new mongoose.Types.ObjectId(productId);

    const matchQuery = {
      deletedAt: null,
      productId: objectId,
    };

    const aggregation = [
      { $match: matchQuery },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },

      {
        $project: {
          _id: 1,
          reviewedBy: { $ifNull: ["$userData.name", "Anonymous"] },
          avatar: "$userData.avatar",
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
        },
      },
    ];

    const reviews = await ReviewModel.aggregate(aggregation);

    // Remove extra item for pagination check
    let nextPage = null;
    if (reviews.length > limit) {
      nextPage = page + 1;
      reviews.pop();
    }

    // Only count once (optimized)
    const totalReview = await ReviewModel.countDocuments(matchQuery);

    return response(true, 200, "Reviews data.", {
      reviews,
      nextPage,
      totalReview,
    });
  } catch (error) {
    return catchError(error);
  }
}