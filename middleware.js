// middleware.js

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Public routes (NO login required)
const isPublicRoute = createRouteMatcher([
  "/",               // Home page
  "/sign-in(.*)",    // Sign in
  "/sign-up(.*)",    // Sign up
]);

// ✅ Protect all non-public routes
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // Requires authentication
  }
});

// ✅ Matcher config recommended by Clerk + Next.js
export const config = {
  matcher: [
    // Skip Next.js internals & all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
