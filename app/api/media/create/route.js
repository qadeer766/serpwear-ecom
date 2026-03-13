import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";

export async function POST(request) {
  try {
    // 🔐 Allow any authenticated user
    const auth = await isAuthenticated();
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();

    // ✅ Validate payload
    if (!Array.isArray(payload) || payload.length === 0) {
      return response(false, 400, "Invalid media payload");
    }

    // ✅ Sanitize allowed fields only
    const sanitizedMedia = payload.map((file) => ({
      asset_id: file.asset_id,
      public_id: file.public_id,
      secure_url: file.secure_url,
      url: file.url,
      width: file.width,
      height: file.height,
      format: file.format,
      resource_type: file.resource_type,
      alt: file.alt || "",
      title: file.title || "",
      deletedAt: null,
    }));

    // ✅ Prevent duplicates using public_id
    const existing = await MediaModel.find({
      public_id: { $in: sanitizedMedia.map((m) => m.public_id) },
    }).lean();

    const existingIds = new Set(existing.map((m) => m.public_id));

    const filteredMedia = sanitizedMedia.filter(
      (m) => !existingIds.has(m.public_id)
    );

    if (filteredMedia.length === 0) {
      return response(false, 400, "Media already exists.");
    }

    const newMedia = await MediaModel.insertMany(filteredMedia);

    return response(true, 200, "Media upload successful.", newMedia);
  } catch (error) {
    return catchError(error);
  }
}