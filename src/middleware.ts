import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    // Clerk will automatically redirect unauthenticated users
  }
});
;

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    "/((?!_next|.*\\..*|favicon.ico|api).*)",
  ],
};
