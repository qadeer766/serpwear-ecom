import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {

    await connectDB();

    const { orderId } = await params;

    // Check authentication for both roles
    const adminAuth = await isAuthenticated("admin");
    const userAuth = await isAuthenticated("user");

    if (!adminAuth?.isAuth && !userAuth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    let order;

    // Admin can see any order
    if (adminAuth?.isAuth) {

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return response(false, 400, "Invalid order id.");
      }

      order = await OrderModel.findById(orderId)
        .populate("user", "name email")
        .populate("products.productId", "name slug")
        .populate("products.variantId", "color size")
        .lean();

    }

    // User can only see their own order
    if (userAuth?.isAuth) {

      order = await OrderModel.findOne({
        order_id: orderId,
        user: userAuth.userId
      })
        .populate("products.productId", "name slug")
        .populate("products.variantId", "color size")
        .lean();

    }

    if (!order) {
      return response(false, 404, "Order not found.");
    }

    return response(true, 200, "Order fetched successfully.", order);

  } catch (error) {
    return catchError(error);
  }
}