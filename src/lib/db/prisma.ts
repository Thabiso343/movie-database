import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma ORM v7 dropped the old "put a connection string in schema.prisma
 * and Prisma quietly manages a connection pool for you" model. Now the
 * generated PrismaClient takes a "driver adapter" instead -- an object
 * that actually knows how to open connections for a specific database
 * (here, Neon's serverless Postgres). We build that adapter ourselves,
 * pointed at DATABASE_URL -- the POOLED connection string -- since this
 * is what runs in the actual app.
 *
 * (Migrations are a separate story: prisma.config.ts points the Prisma
 * CLI at DATABASE_URL_UNPOOLED instead, because `prisma migrate` needs a direct,
 * unpooled connection to take out Postgres advisory locks reliably.)
 */
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

/**
 * Next.js dev mode hot-reloads modules on every file save, which would
 * normally create a brand new PrismaClient (and a brand new pool of
 * database connections) on every single edit. Postgres -- and Neon in
 * particular, which caps concurrent connections on its free tier -- runs
 * out of connections fast if that happens.
 *
 * The fix: stash the client on the Node.js global object, which survives
 * hot reloads (it does NOT survive a full process restart, which is fine
 * -- that's a fresh start anyway). In production there's only ever one
 * instance of the app process, so this codepath is effectively a no-op
 * there; `globalForPrisma` just stays undefined and we create one client.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
