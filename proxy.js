import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute";
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute";
import { jwtVerify } from "jose";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;

  // ================= NO TOKEN =================
  if (!token) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/my-account")
    ) {
      return NextResponse.redirect(
        new URL(WEBSITE_LOGIN, request.url)
      );
    }
    return NextResponse.next();
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (!payload?._id || !payload?.role) {
      throw new Error("Invalid token payload");
    }

    const role = payload.role;

    // ================= BLOCK AUTH PAGES =================
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(
          role === "admin"
            ? ADMIN_DASHBOARD
            : USER_DASHBOARD,
          request.url
        )
      );
    }

    // ================= ADMIN PROTECTION =================
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(
        new URL(WEBSITE_LOGIN, request.url)
      );
    }

    // ================= USER PROTECTION =================
    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(
        new URL(WEBSITE_LOGIN, request.url)
      );
    }

    return NextResponse.next();

  } catch (error) {
    // Clear invalid token
    const response = NextResponse.redirect(
      new URL(WEBSITE_LOGIN, request.url)
    );

    response.cookies.set("access_token", "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};