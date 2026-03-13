import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const isAuthenticated = async (role = null) => {
  try {
    // ✅ MUST await in Next.js 15+
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return { isAuth: false };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (role && payload.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      userId: payload._id,
      role: payload.role,
    };
  } catch (error) {
    return {
      isAuth: false,
    };
  }
};