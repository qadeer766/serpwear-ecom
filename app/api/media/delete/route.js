import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/Cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import mongoose from "mongoose";


// ===============================
// SOFT DELETE / RESTORE
// ===============================
export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete operation.");
    }

    const media = await MediaModel.find({ _id: { $in: ids } }).lean();
    if (!media.length) {
      return response(false, 404, "Data not found.");
    }

    await MediaModel.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          deletedAt: deleteType === "SD" ? new Date() : null,
        },
      }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Media moved to trash."
        : "Media restored successfully."
    );
  } catch (error) {
    return catchError(error);
  }
}


// ===============================
// PERMANENT DELETE
// ===============================
export async function DELETE(request) {
  const session = await mongoose.startSession();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid delete type.");
    }

    session.startTransaction();

    const media = await MediaModel.find({
      _id: { $in: ids },
    }).session(session);

    if (!media.length) {
      await session.abortTransaction();
      return response(false, 404, "Data not found.");
    }

    const publicIds = media.map((m) => m.public_id);

    // 🔥 First delete from Cloudinary
    await cloudinary.api.delete_resources(publicIds);

    // 🔥 Then delete from DB
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Media deleted permanently.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}