import cloudinary from "@/lib/Cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const { paramsToSign } = payload;

    if (!paramsToSign) {
      return NextResponse.json(
        { success: false, message: "Missing paramsToSign" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      success: true,
      signature,
    });

  } catch (error) {
    console.error("Cloudinary Signature Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
