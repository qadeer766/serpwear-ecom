

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/category.model";

export async function POST(request) {
  try {
    // 🔐 Check Admin Auth
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    // ✅ Validate Input
    const schema = zSchema.pick({
      name: true,
      slug: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid or missing fields.",
        validate.error.errors // More detailed validation error response
      );
    }

    let { name, slug } = validate.data;

    // ✅ Normalize values
    name = name.trim();
    slug = slug.trim().toLowerCase();

    // 🔍 Check if category already exists (ignore soft-deleted categories)
    const existingCategory = await CategoryModel.findOne({
      $or: [
        { slug }, // Check if slug already exists
        { name }, // Check if category name already exists
      ],
      deletedAt: null,
    });

    if (existingCategory) {
      return response(false, 409, "Category with this name or slug already exists.");
    }

    // ✅ Create Category
    const newCategory = await CategoryModel.create({
      name,
      slug,
    });

    return response(true, 201, "Category added successfully.", newCategory);
  } catch (error) {
    return catchError(error);
  }
}