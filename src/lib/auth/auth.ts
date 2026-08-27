import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // PrismaAdapter is what makes Auth.js persist users/accounts/sessions into
  // our own Postgres tables (the ones prisma/schema.prisma defines) instead
  // of just holding everything in an encrypted cookie.
  adapter: PrismaAdapter(prisma),

  providers: [GitHub],

  session: {
    // "database" sessions: the session token in the user's cookie is just a
    // random ID that points at a row in our Session table. This is why the
    // Session model exists in schema.prisma at all -- with the alternative
    // ("jwt") strategy, everything would live in the cookie and there'd be
    // nothing to look up. Database sessions cost one extra DB read per
    // request, but they can be revoked server-side (delete the row) and
    // they're the strategy the Prisma adapter is built around.
    strategy: "database",
  },

  callbacks: {
    // With database sessions, this `user` argument is the full row from
    // our User table (looked up via the session token), which is exactly
    // where the real database id lives. By default Auth.js keeps that id
    // out of the session object it hands back to the app -- we copy it in
    // here so the rest of our code (watchlist/ratings/reviews queries) can
    // do session.user.id instead of re-looking-up the user by email.
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
