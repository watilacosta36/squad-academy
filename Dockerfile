# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# --- Dependências -------------------------------------------------------------
# Toolchain presente apenas para o caso de algum módulo nativo precisar compilar
# (better-sqlite3 normalmente baixa o prebuild oficial).
FROM base AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# --- Desenvolvimento (alvo usado pelo docker-compose) -------------------------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# --- Build --------------------------------------------------------------------
FROM deps AS builder
ENV NODE_ENV=production
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Runtime ------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
  && mkdir -p /app/prisma/data /app/public/uploads \
  && chown -R nextjs:nodejs /app/prisma /app/public

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
