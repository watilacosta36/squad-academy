import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MVP: rotas dependem de banco + searchParams, então seguimos com renderização
  // dinâmica padrão (sem exigir Suspense em toda página, como o Cache Components faria).
  cacheComponents: false,

  // Gera o servidor mínimo para a imagem de produção (Docker).
  output: "standalone",

  // Drivers nativos do SQLite/LibSQL não devem passar pelo bundler.
  serverExternalPackages: [
    "@prisma/adapter-better-sqlite3",
    "@prisma/adapter-libsql",
    "@libsql/client",
    "better-sqlite3",
  ],

  experimental: {
    serverActions: {
      // Upload de PDFs (limite de 20mb em src/lib/storage.ts) e capas no /admin.
      bodySizeLimit: "25mb",
    },
  },

  images: {
    remotePatterns: [
      // Capas servidas pelo Vercel Blob em produção.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
