import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

// This is a simple API route that NextAuth uses for callbacks
// It doesn't need a UI component as it's just a redirect handler
export const GET = NextAuth(authOptions); 