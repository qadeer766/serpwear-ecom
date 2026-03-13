import { connectDB } from "@/lib/databaseConnection";
import { catchError, response, generateOTP } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // ================= VALIDATION =================
    const validationSchema = zSchema.pick({
      email: true,
      password: true,
    });

    const parsed = validationSchema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, parsed.error.errors[0]?.message);
    }

    let { email, password } = parsed.data;

    email = email.trim().toLowerCase();

    // ================= FIND USER =================
    const user = await UserModel.findOne({
      email,
      deletedAt: null,
    }).select("+password");

    if (!user) {
      return response(false, 400, "Invalid login credentials.");
    }

    if (!user.isEmailVerified) {
      return response(false, 401, "Email not verified.");
    }

    if (!user.password) {
      return response(false, 400, "Invalid login credentials.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return response(false, 400, "Invalid login credentials.");
    }

    // ================= OTP LOGIC =================
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();

    await OTPModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendMail({
        to: email,
        subject: "Your Login OTP",
        html: otpEmail(otp),
      });
    } catch (mailError) {
      console.error("Email sending failed:", mailError);
      return response(false, 500, "Failed to send OTP email.");
    }

    return response(true, 200, "Please verify your device.", { email });

  } catch (error) {
    return catchError(error);
  }
}