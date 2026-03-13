

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET() {
  try {
    // Check if the admin is authenticated
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    // Connect to the database
    await connectDB();

    // Filter to get only variants that are not deleted
    const filter = { deletedAt: null };

    // Fetch product variants with exclusion of media field for performance
    const variants = await ProductVariantModel.find(filter)
      .select("-media") // Exclude the media field (which can be heavy)
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .lean(); // Use lean for performance when we don't need full Mongoose documents

    // Check if variants are found
    if (variants.length === 0) {
      return response(false, 404, "No product variants found.");
    }

    // Return the response with the found variants
    return response(true, 200, "Data found.", variants);
  } catch (error) {
    // Handle any errors that occur during the request
    return catchError(error);
  }
}