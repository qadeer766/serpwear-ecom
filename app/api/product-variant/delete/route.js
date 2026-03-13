

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";

export async function PUT(request) {
  try {
    // Check admin authorization
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    // Connect to DB
    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    // Validate id list and delete type
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete operation. Delete Type should be SD or RSD.");
    }

    // Find product variants to operate on
    const variants = await ProductVariantModel.find({
      _id: { $in: ids },
    }).lean();

    if (variants.length === 0) {
      return response(false, 404, "No matching product variants found.");
    }

    // Perform soft delete or restore
    const updateAction = deleteType === "SD"
      ? { deletedAt: new Date() }
      : { deletedAt: null };

    await ProductVariantModel.updateMany(
      { _id: { $in: ids } },
      { $set: updateAction }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Product variants moved to trash."
        : "Product variants restored."
    );
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {
  try {
    // Check admin authorization
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    // Connect to DB
    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    // Validate id list and delete type
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid delete operation. Delete Type should be PD.");
    }

    // Find variants to delete
    const variants = await ProductVariantModel.find({
      _id: { $in: ids },
    }).lean();

    if (variants.length === 0) {
      return response(false, 404, "No matching product variants found.");
    }

    // Perform permanent delete
    await ProductVariantModel.deleteMany({
      _id: { $in: ids },
    });

    return response(true, 200, "Product variants deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}