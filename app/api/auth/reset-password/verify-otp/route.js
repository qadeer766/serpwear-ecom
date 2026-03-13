import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/otp.model";

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

    // ================= VERIFY OTP =================
    const otpData = await OTPModel.findOne({ email, otp });

    if (!otpData) {
      return response(false, 400, "Invalid or expired OTP.");
    }

    if (otpData.expiresAt < new Date()) {
      await otpData.deleteOne();
      return response(false, 400, "OTP has expired.");
    }

    // ================= DELETE OTP =================
    await otpData.deleteOne();

    return response(true, 200, "OTP verified successfully.");

  } catch (error) {
    return catchError(error);
  }
}