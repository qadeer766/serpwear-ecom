import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/coupon.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      code: true,
      discountPercentage: true,
      minShoppingAmount: true,
      validity: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid or missing fields.",
        validate.error
      );
    }

    let {
      code,
      discountPercentage,
      minShoppingAmount,
      validity,
    } = validate.data;

    // Normalize
    code = code.trim().toUpperCase();
    discountPercentage = Number(discountPercentage);
    minShoppingAmount = Number(minShoppingAmount);
    validity = new Date(validity);

    // Check duplicate manually (clean error)
    const existingCoupon = await CouponModel.findOne({ code });
    if (existingCoupon) {
      return response(false, 409, "Coupon code already exists.");
    }

    await CouponModel.create({
      code,
      discountPercentage,
      minShoppingAmount,
      validity,
    });

    return response(true, 200, "Coupon added successfully.");
  } catch (error) {
    return catchError(error);
  }
}