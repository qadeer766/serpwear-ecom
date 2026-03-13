import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // ================= VALIDATION =================
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const parsed = validationSchema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, parsed.error.errors[0]?.message);
    }

    let { name, email, password } = parsed.data;

    name = name.trim();
    email = email.trim().toLowerCase();

    // ================= CHECK EXISTING USER =================
    const existingUser = await UserModel.findOne({
      email,
      deletedAt: null,
    });

    if (existingUser) {
      return response(false, 409, "User already registered.");
    }

    // ================= CREATE USER =================
    const newUser = await UserModel.create({
      name,
      email,
      password, // hashed by pre-save middleware
      role: "user", // force role (security)
    });

    // ================= GENERATE VERIFICATION TOKEN =================
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const token = await new SignJWT({
      _id: newUser._id.toString(),
      role: newUser.role,
      type: "email-verification",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // better expiry
      .sign(new TextEncoder().encode(secret));

    // ================= SEND EMAIL =================
    try {
      await sendMail({
        to: email,
        subject: "Verify Your Email",
        html: emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        ),
      });
    } catch (mailError) {
      await UserModel.deleteOne({ _id: newUser._id });
      return response(false, 500, "Failed to send verification email.");
    }

    return response(
      true,
      201,
      "Registration successful. Please verify your email."
    );

  } catch (error) {
    return catchError(error);
  }
}