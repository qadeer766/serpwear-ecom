import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/coupon.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      _id: true,
      code: true,
      discountPercentage: true,
      minShoppingAmount: true,
      validity: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const { _id, code, discountPercentage, minShoppingAmount, validity } =
      validate.data;

    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid coupon ID.");
    }

    const coupon = await CouponModel.findOne({
      _id,
      deletedAt: null,
    });

    if (!coupon) {
      return response(false, 404, "Coupon not found.");
    }

    // ✅ Proper assignments (no commas)
    coupon.code = code;
    coupon.discountPercentage = discountPercentage;
    coupon.minShoppingAmount = minShoppingAmount;
    coupon.validity = validity;

    await coupon.save();

    return response(true, 200, "Coupon updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}