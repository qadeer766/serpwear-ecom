import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/order.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";
import MediaModel from "@/models/media.model";
export async function GET() {
  try {
    await connectDB();
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const userId = auth.userId;
    


    //get recent orders
    const recentOrders = await OrderModel.find({
      user: userId,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("products.productId", "name slug")
      .populate("products.variantId", "color size")
      .lean();

    // get total order count
    const totalOrder = await OrderModel.countDocuments({ user: userId });

    return response(true, 200, "Dashboard info.", { recentOrders, totalOrder });
  } catch (error) {
    return catchError(error);
  }
}
