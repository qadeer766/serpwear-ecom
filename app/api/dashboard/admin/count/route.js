import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import OrderModel from "@/models/order.model";
import ProductModel from "@/models/product.model";
import UserModel from "@/models/user.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const activeFilter = {
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } },
      ],
    };

    const [category, product, customer,order] = await Promise.all([
      CategoryModel.countDocuments(activeFilter),
      ProductModel.countDocuments(activeFilter),
      UserModel.countDocuments(activeFilter),
      OrderModel.countDocuments(activeFilter),
    ]);

    return response(true, 200, "Dashboard count.", {
      category,
      product,
      customer,
      order
    });
  } catch (error) {
    return catchError(error);
  }
}