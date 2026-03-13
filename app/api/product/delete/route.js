

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/product.model";

/* ================= SOFT DELETE / RESTORE ================= */
export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();
    const { ids = [], deleteType } = payload;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    // Validate deleteType
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete operation. Delete Type should be SD or RSD.");
    }

    const updateData = deleteType === "SD" ? { $set: { deletedAt: new Date() } } : { $set: { deletedAt: null } };

    // Perform update operation in one step
    const result = await ProductModel.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    if (result.nModified === 0) {
      return response(false, 404, "No products found or already in the requested state.");
    }

    return response(
      true,
      200,
      deleteType === "SD" ? "Data moved into trash." : "Data restored."
    );
  } catch (error) {
    return catchError(error);
  }
}

/* ================= PERMANENT DELETE ================= */
export async function DELETE(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();
    const { ids = [], deleteType } = payload;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid delete operation. Delete Type should be PD.");
    }

    // Perform permanent delete in one operation
    const result = await ProductModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return response(false, 404, "No products found to delete.");
    }

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}