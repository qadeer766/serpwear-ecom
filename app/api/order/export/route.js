import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";

import OrderModel from "@/models/order.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const getOrder = await OrderModel.find({ deletedAt: null }).select('-products')
      .sort({ createdAt: -1 })
      .lean();

    // Always return success — even if empty
    return response(true, 200, "Data fetched successfully.", getOrder);

  } catch (error) {
    return catchError(error);
  }
}