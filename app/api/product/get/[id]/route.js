

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/product.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    // Check if admin is authenticated
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    // Destructure and ensure params is valid
    const { id } = params || {}; // Safely handle 'params'

    // Validate the product ID
    if (!id || !isValidObjectId(id)) {
      return response(false, 400, "Invalid object ID.");
    }

    // Fetch the product, ensuring it's not deleted and populating necessary fields
    const product = await ProductModel.findOne({
      _id: id,
      deletedAt: null, // Ensure the product is not soft-deleted
    })
      .populate("media", "_id secure_url") // Only include relevant fields for media
      .populate("categoryId", "name slug") // Populate category with name and slug
      .lean(); // Return a plain JavaScript object (not a Mongoose document)

    // If no product is found, return a 404 response
    if (!product) {
      return response(false, 404, "Product not found or has been deleted.");
    }

    // Successfully found the product
    return response(true, 200, "Product found.", product);
  } catch (error) {
    // Catch and handle errors, returning an appropriate response
    return catchError(error);
  }
}