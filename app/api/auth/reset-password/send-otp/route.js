import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/otp.model";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // ================= VALIDATION =================
    const validationSchema = zSchema.pick({ email: true });
    const parsed = validationSchema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, parsed.error.errors[0]?.message);
    }

    let { email } = parsed.data;
    email = email.trim().toLowerCase();

    // ================= FIND USER =================
    const user = await UserModel.findOne({
      email,
      deletedAt: null,
    });

    // 🔐 Do NOT reveal if user exists (security best practice)
    if (!user) {
      return response(
        true,
        200,
        "If this email exists, an OTP has been sent."
      );
    }

    if (!user.isEmailVerified) {
      return response(false, 401, "Email not verified.");
    }

    // ================= RATE LIMIT =================
    const existingOtp = await OTPModel.findOne({ email });

    if (existingOtp) {
      const timeRemaining =
        (existingOtp.expiresAt - new Date()) / 1000;

      if (timeRemaining > 540) {
        return response(
          false,
          429,
          "Please wait before requesting another OTP."
        );
      }
    }

    // ================= CREATE OTP =================
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();

    await OTPModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // consistent 10 min
    });

    try {
      await sendMail({
        to: email,
        subject: "Reset Password Verification Code",
        html: otpEmail(otp),
      });
    } catch (mailError) {
      console.error("Reset OTP email error:", mailError);
      return response(false, 500, "Failed to send OTP.");
    }

    return response(true, 200, "OTP sent successfully.");

  } catch (error) {
    return catchError(error);
  }
}