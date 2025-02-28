import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply middleware to all protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/projects/:path*",
  ],
}; 