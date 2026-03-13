import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/user.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    // Only normal users (not admins) & not deleted
    const filter = {
      role: "user",       // ✅ Important for customers route
      deletedAt: null,
    };

    const customers = await UserModel.find(filter)
      .sort({ createdAt: -1 })
      .select("-password") // ✅ Never export password
      .lean();

    return response(true, 200, "Data found.", customers);

  } catch (error) {
    return catchError(error);
  }
}