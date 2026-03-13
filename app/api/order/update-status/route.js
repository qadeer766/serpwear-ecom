import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/order.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {

    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const { _id, status } = await request.json();

    if (!_id || !status) {
      return response(false, 400, "Order id and status are required.");
    }

    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid order id.");
    }

    const order = await OrderModel.findById(_id);

    if (!order) {
      return response(false, 404, "Order not found.");
    }

    order.status = status;

    await order.save();

    return response(true, 200, "Order status updated successfully.", order);

  } catch (error) {
    return catchError(error);
  }
}