import type { DefaultSession } from "next-auth";

// By default, Auth.js's `session.user` only carries name/email/image --
// it deliberately keeps the session payload small. We need the actual
// database user id too (to know *whose* watchlist/ratings/reviews we're
// reading), so we add it here via the `session` callback in auth.ts, and
// tell TypeScript about the extra field with this module augmentation.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
