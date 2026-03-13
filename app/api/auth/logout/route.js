import { NextResponse } from "next/server";
import { catchError } from "@/lib/helperFunction";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // expire immediately
      path: "/",
    });

    return response;

  } catch (error) {
    return catchError(error);
  }
}