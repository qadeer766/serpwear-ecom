
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/product.model";

export async function GET() {
  try {
    // Check if admin is authenticated
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    // Filter to get only active (not soft-deleted) products
    const filter = { deletedAt: null };

    // Fetch products with exclusion of heavy fields like media and description
    const products = await ProductModel.find(filter)
      .select("-media -description") // Exclude unnecessary fields
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .lean(); // Return plain JavaScript objects instead of Mongoose documents

    // If no products are found, return a success response with empty data
    if (products.length === 0) {
      return response(true, 200, "No products found.", []); // Return empty array in success response
    }

    // Return the found products
    return response(true, 200, "Data found.", products);
  } catch (error) {
    return catchError(error); // Handle errors from database or other sources
  }
}

