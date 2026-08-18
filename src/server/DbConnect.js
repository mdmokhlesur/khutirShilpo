import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const DbConnect =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = DbConnect;
}

export default DbConnect;
