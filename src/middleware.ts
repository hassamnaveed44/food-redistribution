import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isBusinessRoute = createRouteMatcher(["/business/(.*)", "/business"]);
const isNgoRoute = createRouteMatcher(["/ngo/(.*)", "/ngo"]);
const isAdminRoute = createRouteMatcher(["/admin/(.*)", "/admin"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If visiting protected role routes, require user authentication
  if (isBusinessRoute(req) || isNgoRoute(req) || isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jwt|json|png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|cur|mp4|webm|mov|ogg|mp3|wav|flac|aac)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
