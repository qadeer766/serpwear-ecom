import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const { id } = params;

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid object id.");
    }

    const getMedia = await MediaModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!getMedia) {
      return response(false, 404, "Media not found.");
    }

    return response(true, 200, "Media found.", getMedia);
  } catch (error) {
    return catchError(error);
  }
}