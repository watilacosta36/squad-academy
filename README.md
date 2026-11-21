# Squad Academy

Portal educacional e tático em **pt-BR** para jogadores de **Squad** (Offworld Industries):
artigos/guias em Markdown + manuais e apostilas em PDF, com painel administrativo próprio.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, Proxy) |
| Linguagem | TypeScript estrito |
| Estilo | Tailwind CSS 4 (tema escuro tático) + `@tailwindcss/typography` |
| Banco | SQLite via Prisma 7 (`@prisma/adapter-better-sqlite3` local, `@prisma/adapter-libsql` no Turso) |
| Storage | Local (`public/uploads`) ou Vercel Blob |
| Auth | Sessão JWT em cookie httpOnly (`jose` + `bcryptjs`) |
| Deploy | Docker (Ubuntu) ou Vercel + Turso + Vercel Blob |

## Requisitos

- **Node.js 22+** (Prisma 7 exige ≥ 20.19)
- **npm 10+**
- **Docker + Docker Compose v2** (para o ambiente em container)

## Rodando localmente

### Opção A — Docker (recomendada)

```bash
cp .env.example .env
docker compose up -d

# primeira execução: cria as tabelas e popula o conteúdo de exemplo
docker compose exec web npm run db:push
docker compose exec web npm run db:seed
```

Acesse <http://localhost:3000> e o painel em <http://localhost:3000/admin/login>.

> O SQLite fica no volume `sqlite_data` (`/app/prisma/data`) e os uploads em `uploads`
> (`/app/public/uploads`) — rebuilds não apagam dados.

### Opção B — Node local

```bash
npm install
cp .env.example .env
npm run db:push     # gera o client + cria/sincroniza o SQLite
npm run db:seed
npm run dev
```

### Credenciais de desenvolvimento

Definidas no `.env`:

- **E-mail:** `admin@squadacademy.com.br`
- **Senha:** `squad123`

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | sim | `file:./prisma/data/dev.db` (local) ou `libsql://...` (Turso) |
| `DATABASE_AUTH_TOKEN` | só Turso | Token do banco libSQL |
| `STORAGE_PROVIDER` | sim | `local` ou `vercel-blob` |
| `BLOB_READ_WRITE_TOKEN` | só Blob | Token do Vercel Blob |
| `ADMIN_EMAIL` | sim | E-mail de acesso ao `/admin` |
| `ADMIN_PASSWORD` | sim* | Senha em texto puro (dev) |
| `ADMIN_PASSWORD_HASH` | sim* | Hash bcrypt (tem prioridade sobre a senha) |
| `SESSION_SECRET` | sim | Segredo do cookie de sessão (≥ 16 caracteres) |
| `COOKIE_SECURE` | não | `true`/`false` para forçar o atributo Secure do cookie; vazio detecta por `x-forwarded-proto`/`NEXT_PUBLIC_SITE_URL` |
| `NEXT_PUBLIC_SITE_URL` | sim | URL pública do site (usada em metadata/sitemap) |

\* informe ao menos uma das duas formas de senha.

Gerar segredo e hash:

```bash
openssl rand -hex 32
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate \
  node -e "require('bcryptjs').hash('SUA_SENHA', 10).then(console.log)"
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `prisma generate` + build de produção |
| `npm run start` | Sobe o build (`next start`) |
| `npm run lint` | ESLint |
| `npm run db:generate` | Gera o client em `src/generated/prisma` |
| `npm run db:push` | Gera o client e sincroniza o schema com o banco |
| `npm run db:seed` | Popula categorias, artigos e manuais de exemplo |
| `npm run db:studio` | Abre o Prisma Studio |

## Estrutura

```
prisma/            schema.prisma, seed.ts e data/dev.db (ignorado)
src/app/(public)/  home, artigos, manuais, categorias, busca, not-found
src/app/admin/     login + (protected) com painel e CRUDs
src/app/api/       healthcheck e download/visualização de PDFs
src/components/    ui/, public/, admin/
src/lib/           db, storage, auth, session, validation, data/, actions/
src/generated/     client do Prisma (gerado, ignorado)
```

## Área administrativa

- `/admin/login` — autenticação por cookie assinado (8 h)
- `/admin` — métricas (artigos, manuais, downloads) e recentes
- `/admin/categorias` — CRUD de trilhas
- `/admin/artigos` — CRUD com Markdown, nível, versão e status
- `/admin/manuais` — CRUD com upload de PDF + capa

O proxy (`src/proxy.ts`) bloqueia `/admin/**`; o layout protegido reforça a checagem com
`requireAdmin()`.

---

# Deploy em servidor Ubuntu (Docker)

Runbook detalhado (instalação, atualização, backup, rollback e troubleshooting):
**[DEPLOY.md](./DEPLOY.md)**.

Guia para rodar em um **Ubuntu Server** local (LAN ou VPS), com persistência de banco e uploads.

## 1. Instalar Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"   # faça logout/login depois
```

## 2. Obter o projeto

```bash
git clone <url-do-repositorio> squad-academy
cd squad-academy
```

(sem repositório: envie a pasta via `rsync -av --exclude node_modules --exclude .next ./ usuario@servidor:~/squad-academy/`)

## 3. Configurar o ambiente

```bash
cp .env.production.example .env.production
nano .env.production
```

Preencha no mínimo:

- `ADMIN_EMAIL` e `ADMIN_PASSWORD` (ou `ADMIN_PASSWORD_HASH`)
- `SESSION_SECRET` (`openssl rand -hex 32`)
- `NEXT_PUBLIC_SITE_URL` com o endereço real, ex.: `http://192.168.0.10:3000`

> `NEXT_PUBLIC_SITE_URL` é **embutido no build**. Se mudar depois, refaça o build.

## 4. Build da imagem

```bash
docker compose -f docker-compose.prod.yml build
```

## 5. Criar o banco e popular (primeira vez)

```bash
# cria/sincroniza as tabelas (já ajusta o dono do arquivo para o usuário da app)
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate

# conteúdo de exemplo (idempotente)
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate npx prisma db seed
```

## 6. Subir a aplicação

```bash
docker compose -f docker-compose.prod.yml up -d

# verificar
docker compose -f docker-compose.prod.yml ps
curl http://localhost:3000/api/health
```

Acesse `http://IP_DO_SERVIDOR:3000`. Se houver firewall:

```bash
sudo ufw allow 3000/tcp
```

## 7. Atualizar a aplicação

```bash
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate
docker compose -f docker-compose.prod.yml up -d
```

## 8. Logs e diagnóstico

```bash
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml exec web node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>r.text()).then(console.log)"
```

## 9. Backup

```bash
mkdir -p backups

# banco SQLite
docker run --rm -v squad-academy_sqlite_data:/data -v "$PWD/backups":/backup alpine \
  tar czf /backup/db-$(date +%F).tar.gz -C /data .

# uploads (PDFs e capas)
docker run --rm -v squad-academy_uploads:/data -v "$PWD/backups":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

Restaurar: suba a aplicação com `up -d`, pare (`down`), extraia o `.tar.gz` de volta no volume
com o mesmo comando `docker run ... tar xzf` e suba novamente.

## 10. Nginx na frente (domínio + HTTPS)

`/etc/nginx/sites-available/squad-academy`:

```nginx
server {
    listen 80;
    server_name squad.seudominio.com;

    client_max_body_size 25m;   # uploads de PDF/capa

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/squad-academy /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d squad.seudominio.com
```

Com domínio/HTTPS, ajuste `NEXT_PUBLIC_SITE_URL=https://squad.seudominio.com` e rode o build de novo.

## 11. Alternativa sem Docker (systemd)

```bash
npm ci
npm run build
PORT=3000 HOSTNAME=0.0.0.0 npx next start
```

Crie um serviço systemd apontando para esse comando, com `WorkingDirectory` no projeto e
`EnvironmentFile=.env.production`. Mantenha `prisma/data/` e `public/uploads/` fora do
controle de versão e com backup.

---

# Deploy na Vercel (Turso + Blob)

1. Crie o banco no Turso e guarde URL + token:
   ```bash
   turso db create squad-academy
   turso db show squad-academy --url
   turso db tokens create squad-academy
   ```
2. Aplique o schema apontando para o Turso (da máquina local):
   ```bash
   DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npx prisma db push
   DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npx prisma db seed
   ```
3. Na Vercel, configure as variáveis: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`,
   `STORAGE_PROVIDER=vercel-blob`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`.
4. Build command: `npm run build` (já executa `prisma generate`).

> Limite da Vercel: requisições de Server Action aceitam ~4,5 MB. Para PDFs maiores,
> use upload direto ao Blob pelo cliente (evolução prevista).

## Solução de problemas

| Sintoma | Causa / solução |
|---|---|
| `no such table` nas páginas | Banco sem schema: rode `db:push` (local ou serviço `migrate`) |
| `readonly database` | Dono do `dev.db` diferente do uid 1001; rode o `migrate` (ele faz `chown`) |
| PDF do seed retorna 404 | Normal: os PDFs de exemplo não existem; envie um manual no `/admin` |
| Login sempre inválido | Confira `ADMIN_EMAIL`/`ADMIN_PASSWORD(_HASH)` e reinicie o container |
| Sessão cai após restart | `SESSION_SECRET` ausente/mudou entre execuções |
| `next start` avisa sobre `standalone` | Aviso esperado; em produção use o container (`node server.js`) |
| Upload rejeitado | Limite de 20 MB (PDF) / 5 MB (capa) em `src/lib/storage.ts` |

## Aviso

Projeto independente, sem afiliação com a Offworld Industries. *Squad* e marcas relacionadas
pertencem aos seus respectivos donos.
