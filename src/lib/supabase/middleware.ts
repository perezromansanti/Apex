import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1h
const LAST_ACTIVITY_COOKIE = "last_activity";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth");
  const isPublicAsset = request.nextUrl.pathname.startsWith("/_next");

  if (!user && !isAuthRoute && !isPublicAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && !isAuthRoute && !isPublicAsset) {
    const lastActivity = request.cookies.get(LAST_ACTIVITY_COOKIE)?.value;
    const now = Date.now();

    if (lastActivity && now - Number(lastActivity) > INACTIVITY_LIMIT_MS) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete(LAST_ACTIVITY_COOKIE);
      return response;
    }

    supabaseResponse.cookies.set(LAST_ACTIVITY_COOKIE, String(now), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: (INACTIVITY_LIMIT_MS / 1000) * 2,
    });
  }

  return supabaseResponse;
}
