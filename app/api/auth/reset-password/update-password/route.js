import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/otp.model";

export async function PUT(request) {
  try {
    await connectDB();

    const payload = await request.json();

    /* ================= VALIDATION ================= */
    const validationSchema = zSchema.pick({
      email: true,
      password: true,
      otp: true,
    });

    const parsed = validationSchema.safeParse(payload);

    if (!parsed.success) {
      return response(
        false,
        400,
        parsed.error.issues[0]?.message
      );
    }

    let { email, password, otp } = parsed.data;

    email = email.trim().toLowerCase();
    otp = otp.toString(); // 🔒 ensure string match

    /* ================= VERIFY OTP ================= */
    const otpData = await OTPModel.findOne({ email, otp }).lean();

    if (!otpData) {
      return response(false, 400, "Invalid or expired OTP.");
    }

    if (otpData.expiresAt < new Date()) {
      await OTPModel.deleteOne({ _id: otpData._id });
      return response(false, 400, "OTP has expired.");
    }

    /* ================= FIND USER ================= */
    const user = await UserModel.findOne({
      email,
      deletedAt: null,
    }).select("+password");

    if (!user) {
      return response(false, 404, "User not found.");
    }

    if (!user.isEmailVerified) {
      return response(false, 401, "Email not verified.");
    }

    /* ================= UPDATE PASSWORD ================= */
    user.password = password; // will hash via pre-save hook
    await user.save();

    /* ================= DELETE OTP ================= */
    await OTPModel.deleteMany({ email });

    return response(true, 200, "Password updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}