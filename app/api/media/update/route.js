import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      _id: true,
      alt: true,
      title: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing field.", validate.error);
    }

    const { _id, alt, title } = validate.data;

    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid object id.");
    }

    const media = await MediaModel.findOne({
      _id,
      deletedAt: null, // prevent editing trashed media
    });

    if (!media) {
      return response(false, 404, "Media not found.");
    }

    media.alt = alt;
    media.title = title;

    await media.save();

    return response(true, 200, "Media updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}