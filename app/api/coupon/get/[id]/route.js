import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/coupon.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const { id } = params;

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid object id.");
    }

    const coupon = await CouponModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!coupon) {
      return response(false, 404, "Coupon not found.");
    }

    return response(true, 200, "Coupon found.", coupon);

  } catch (error) {
    return catchError(error);
  }
}