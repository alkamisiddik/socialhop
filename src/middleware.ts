import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return; // allow public routes
  // Protected routes: Clerk handles redirect automatically
});

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    "/((?!_next|.*\\..*|favicon.ico).*)",
  ],
};
