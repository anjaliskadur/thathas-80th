import { PrismaClient } from "@prisma/client";

// Prevents hot-reload in dev (and cold-start bursts in serverless) from
// spawning a new PrismaClient - and a new pool of DB connections - on every
// module reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
