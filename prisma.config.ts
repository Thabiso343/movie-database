import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma no longer auto-loads .env files as of v7 -- and Next.js's own env
// loading (the part that understands .env.local) only kicks in inside the
// Next.js dev/build process. The Prisma CLI (this file) runs as a totally
// separate process, so we load .env.local ourselves here.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // (Named DATABASE_URL_UNPOOLED, not something like DIRECT_URL, because
    // that's the exact name Vercel's Neon integration auto-injects for every
    // environment -- Production, Preview, and Development each get their
    // own value for it automatically, no manual setup needed on Vercel.)
    //
    // This `url` is what the Prisma CLI itself uses -- for `migrate dev`,
    // `db push`, `studio`, etc. It is DELIBERATELY the DIRECT (unpooled)
    // connection string, not the pooled one: migrations take out Postgres
    // advisory locks, which don't survive being routed through Neon's
    // PgBouncer connection pooler reliably.
    //
    // This is completely separate from what the *app* uses at runtime:
    // src/lib/db/prisma.ts builds its own PrismaNeon adapter pointed at
    // DATABASE_URL (the pooled connection) -- schema.prisma's datasource
    // block no longer carries a url at all in Prisma ORM v7.
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
