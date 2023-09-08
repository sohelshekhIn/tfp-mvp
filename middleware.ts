import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    // If not signed in, redirect to /login for all paths except /login.
    if (req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // If signed in, check user metadata.
    if (data.session?.user.user_metadata.role === "member") {
      // If the user is a member, they have access to /member.
      if (req.nextUrl.pathname !== "/member") {
        return NextResponse.redirect(new URL("/member", req.url));
      }
    } else if (data.session?.user.user_metadata.role === "admin") {
      // If the user is not a member, they have access to /admin.
      if (!req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  }
  return res;
}

export const config = {
  matcher: ["/", "/login", "/member/:path*", "/admin/:path*"],
};
