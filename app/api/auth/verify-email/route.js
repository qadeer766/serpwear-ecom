import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return response(false, 400, "Missing or invalid token.");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    let payload;

    try {
      const verified = await jwtVerify(
        token.trim(),
        new TextEncoder().encode(secret)
      );
      payload = verified.payload;
    } catch {
      return response(false, 401, "Invalid or expired token.");
    }

    // 🔐 Ensure token type is correct
    if (payload?.type !== "email-verification") {
      return response(false, 403, "Invalid token type.");
    }

    const userId = payload?._id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return response(false, 400, "Invalid user ID.");
    }

    const user = await UserModel.findOne({
      _id: userId,
      deletedAt: null,
    });

    if (!user) {
      return response(false, 404, "User not found.");
    }

    if (user.isEmailVerified) {
      return response(true, 200, "Email already verified.");
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Email verified successfully.", {
      email: user.email,
      name: user.name,
    });

  } catch (error) {
    return catchError(error);
  }
}