import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/review.model";
import MediaModel from "@/models/media.model";
export async function GET() {
  try {

    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

   const latestReview = await ReviewModel.find({
  deletedAt: null
})
.sort({ createdAt: -1 })
.limit(10)
.populate({
  path: "productId",
  select: "name media",
  populate: {
    path: "media",
    select: "secure_url"
  }
})
.lean();

const validReviews = latestReview.filter(r => r.productId);

return response(true, 200, "Latest review", validReviews);



  } catch (error) {
    return catchError(error);
  }
}