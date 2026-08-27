import { handlers } from "@/lib/auth/auth";

// This one line is the entire file. Auth.js's `handlers` object already
// contains fully-formed GET/POST route handlers -- for the sign-in page,
// the GitHub redirect, the OAuth callback, sign-out, session lookups, etc.
// The [...nextauth] catch-all segment in this folder's name means every
// path under /api/auth/* (e.g. /api/auth/signin, /api/auth/callback/github)
// gets routed through here.
export const { GET, POST } = handlers;
