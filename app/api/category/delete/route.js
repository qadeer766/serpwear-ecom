


import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import mongoose from "mongoose";

// ----------------------------------------
// SOFT DELETE / RESTORE
// ----------------------------------------
export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();

    const { ids = [], deleteType } = payload;

    // Validate IDs and delete type
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return response(false, 400, "Invalid ID format.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Delete type must be SD (soft delete) or RSD (restore)."
      );
    }

    // Check if the categories exist
    const existing = await CategoryModel.find({ _id: { $in: validIds } });

    if (!existing.length) {
      return response(false, 404, "Data not found.");
    }

    // Perform soft delete or restore
    await CategoryModel.updateMany(
      { _id: { $in: validIds } },
      {
        $set: {
          deletedAt: deleteType === "SD" ? new Date() : null,
        },
      }
    );

    return response(
      true,
      200,
      deleteType === "SD" ? "Data moved to trash." : "Data restored successfully."
    );
  } catch (error) {
    return catchError(error);
  }
}

// ----------------------------------------
// PERMANENT DELETE
// ----------------------------------------
export async function DELETE(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();

    const { ids = [], deleteType } = payload;

    // Validate delete type and ID list
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Delete type must be PD (permanent delete)."
      );
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return response(false, 400, "Invalid ID format.");
    }

    // Check if the categories exist
    const existing = await CategoryModel.find({ _id: { $in: validIds } });

    if (!existing.length) {
      return response(false, 404, "Data not found.");
    }

    // Perform permanent delete
    await CategoryModel.deleteMany({ _id: { $in: validIds } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}