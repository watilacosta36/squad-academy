import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "../generated/prisma/client";

const DEFAULT_DATABASE_URL = "file:./prisma/data/dev.db";

/**
 * Seleciona o driver de acordo com a URL:
 * - `file:` -> SQLite local via better-sqlite3 (dev / Docker)
 * - `libsql://` ou `https://` -> Turso em produção
 *
 * Caminhos relativos são resolvidos a partir do diretório de execução,
 * o mesmo critério usado pelo `prisma.config.ts`.
 */
function createAdapter() {
  const url = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;

  if (url.startsWith("file:")) {
    return new PrismaBetterSqlite3({ url });
  }

  return new PrismaLibSql({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({ adapter: createAdapter() });
}

/**
 * Em desenvolvimento o hot reload reavalia os módulos; reaproveitamos a
 * instância no `globalThis` para não abrir conexões duplicadas.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
