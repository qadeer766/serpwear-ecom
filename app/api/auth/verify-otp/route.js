import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/otp.model";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // ================= VALIDATION =================
    const validationSchema = zSchema.pick({
      email: true,
      otp: true,
    });

    const parsed = validationSchema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, parsed.error.errors[0]?.message);
    }

    let { email, otp } = parsed.data;

    email = email.trim().toLowerCase();

    // ================= FIND OTP =================
    const otpData = await OTPModel.findOne({ email, otp });

    if (!otpData) {
      return response(false, 400, "Invalid or expired OTP.");
    }

    if (otpData.expiresAt < new Date()) {
      await OTPModel.deleteOne({ _id: otpData._id });
      return response(false, 400, "OTP has expired.");
    }

    // ================= FIND USER =================
    const user = await UserModel.findOne({
      email,
      deletedAt: null,
    });

    if (!user) {
      return response(false, 404, "User not found.");
    }

    if (!user.isEmailVerified) {
      return response(false, 401, "Email not verified.");
    }

    // ================= CREATE JWT =================
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const tokenPayload = {
      _id: user._id.toString(),
      role: user.role,
    };

    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(secret));

    // ================= CREATE RESPONSE =================
    const res = NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        _id: user._id,
        role: user.role,
        name: user.name,
        avatar: user.avatar?.url || null,
      },
    });

    // ================= SET COOKIE PROPERLY =================
    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // ================= DELETE OTP =================
    await OTPModel.deleteMany({ email });

    return res;

  } catch (error) {
    return catchError(error);
  }
}