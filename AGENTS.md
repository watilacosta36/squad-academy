# AGENTS.md — Squad Academy

Portal educacional e tático em **pt-BR** para jogadores de *Squad* (artigos técnicos + manuais/apostilas em PDF).
Deploy alvo: **Vercel** + **Turso** (SQLite serverless) + **Vercel Blob**.
Desenvolvimento local: **Docker** (`node:22-bookworm-slim`) com SQLite em `prisma/data/dev.db` e uploads em `public/uploads/`.

## Stack e Convenções
- **Framework:** Next.js 16 (App Router), TypeScript estrito, Server Actions e Route Handlers.
- **Estilo:** Tailwind CSS 4, *dark mode* tático (grafite/chumbo, verde-oliva/cáqui, destaques âmbar/laranja).
- **Banco e ORM:** Prisma 7 (`prisma.config.ts`) com `provider = "prisma-client"` gerando em `src/generated/prisma` (`moduleFormat = "esm"`, `importFileExtension = "ts"`).
- **Adapters DB:** `src/lib/db.ts` seleciona dinamicamente `@prisma/adapter-better-sqlite3` (`file:./prisma/data/dev.db` em dev) ou `@prisma/adapter-libsql` (`libsql://` / `https://` no Turso).
- **Storage:** `src/lib/storage.ts` (`STORAGE_PROVIDER=local` salvando em `public/uploads/` em dev; `vercel-blob` em prod).
- **Auth Admin:** Sessão via cookie assinado (`jose` + `bcryptjs`) validando `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
- **Idioma:** Todo texto de UI, mensagens e comentários em português (`pt-BR`).

## Estrutura de Pastas
- `src/app/(public)/`: Home, listagem e leitura de artigos, catálogo de manuais em PDF.
- `src/app/admin/`: Login (`/admin/login`) e CRUD de categorias, artigos e manuais.
- `src/app/api/`: Endpoints auxiliares (ex.: incremento de download de PDF).
- `src/components/`: Componentes de UI e formulários.
- `src/lib/`: `db.ts`, `storage.ts`, `auth.ts`, `constants.ts`, `slug.ts`, `validation.ts`, `data/*`, `actions/*`.
- `src/generated/prisma/`: Client gerado pelo Prisma (ignorado no ESLint e Git).
- `prisma/`: `schema.prisma`, `seed.ts` e pasta `data/` para o `dev.db` local.

## Regras para Economizar Tokens no OpenCode
1. **Execução estrita por fase:** Execute apenas a fase solicitada no turno atual. Nunca avance para a próxima fase sem aprovação.
2. **Leitura cirúrgica:** Leia apenas os arquivos diretamente ligados à tarefa atual antes de editar.
3. **Sem explicações longas:** Entregue código direto e um resumo curto do que foi feito/validado.
4. **Validação pontual:** Ao final da fase, rode apenas os comandos de verificação indicados para ela.

## Comandos Úteis
- Subir ambiente local: `docker compose up -d`
- Gerar client e sincronizar banco local: `npx prisma generate && npx prisma db push`
- Popular banco: `npm run db:seed`
- Lint e build: `npm run lint` / `npm run build`