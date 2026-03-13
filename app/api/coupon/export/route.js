import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/coupon.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const coupons = await CouponModel.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();

    // Always return success — even if empty
    return response(true, 200, "Data fetched successfully.", coupons);

  } catch (error) {
    return catchError(error);
  }
}