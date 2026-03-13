


import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/category.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    // 🔐 Check if the user is authenticated as an admin
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized access.");
    }

    const payload = await request.json();

    // ✅ Validate input data
    const schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors); // Provide detailed validation errors
    }

    const { _id, name, slug } = validate.data;

    // 🔍 Validate the category ID format
    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid category ID format.");
    }

    await connectDB();

    // 🔄 Check for duplicate slug (excluding the current category)
    const existingSlug = await CategoryModel.findOne({
      slug,
      _id: { $ne: _id },
    });

    if (existingSlug) {
      return response(false, 409, "Slug already exists.");
    }

    // ✅ Update the category
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id, deletedAt: null }, // Make sure the category is not soft-deleted
      { name, slug },
      { new: true } // Return the updated category
    );

    if (!updatedCategory) {
      return response(false, 404, "Category not found or has been deleted.");
    }

    // ✅ Successfully updated category
    return response(true, 200, "Category updated successfully.", updatedCategory); // Return the updated category object
  } catch (error) {
    return catchError(error);
  }
}