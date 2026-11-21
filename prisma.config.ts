import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "prisma/config";

/**
 * O Prisma 7 não carrega `.env` automaticamente (daí o import de `dotenv/config`).
 * Também resolvemos caminhos `file:` para absolutos para que a CLI (`db push`,
 * `migrate`) e o runtime (`src/lib/db.ts`) usem exatamente o mesmo arquivo,
 * independente do diretório de execução.
 */
function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "file:./prisma/data/dev.db";

  if (!url.startsWith("file:")) {
    return url;
  }

  const filePath = url.slice("file:".length);
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  // Garante que `prisma/data/` exista antes de o SQLite criar o arquivo.
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

  return `file:${absolutePath}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
