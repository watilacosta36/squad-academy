# DEPLOY — Squad Academy (Ubuntu Server)

Runbook operacional para instalar, atualizar e manter o Squad Academy em um servidor Ubuntu
(22.04/24.04), com Docker. Para visão geral da aplicação, stack e desenvolvimento local, veja o
[`README.md`](./README.md).

**Topologia:**

```
navegador → [ Nginx opcional :80/443 ] → container web :3000
                                            ├── volume sqlite_data  (/app/prisma/data)
                                            └── volume uploads      (/app/public/uploads)
```

Tudo que é estado (banco e arquivos) vive em volumes Docker. Rebuild e redeploy **não** apagam dados.

---

## 0. Checklist antes de começar

- [ ] Ubuntu 22.04+ com acesso `sudo`
- [ ] Docker Engine + Compose plugin instalados (`docker compose version`)
- [ ] Porta 3000 livre (ou 80/443, se usar Nginx)
- [ ] IP fixo ou hostname do servidor definido (ex.: `192.168.0.10`)
- [ ] `SESSION_SECRET` gerado
- [ ] Senha do admin definida (ou hash bcrypt)
- [ ] Código do projeto no servidor (git ou rsync)
- [ ] `NEXT_PUBLIC_SITE_URL` já com o endereço final de acesso

---

## 1. Preparar o host

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git ufw

# fuso horário (afeta datas exibidas)
sudo timedatectl set-timezone America/Sao_Paulo

# firewall: SSH + HTTP(S) e, se for acessar direto, a porta da app
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp    # remova se usar Nginx na frente
sudo ufw enable
```

### Instalar Docker (repositório oficial)

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

> Faça logout/login (ou `newgrp docker`) para usar `docker` sem `sudo`.

Verificação:

```bash
docker --version
docker compose version
```

---

## 2. Obter o código

Com repositório Git:

```bash
git clone <url-do-repositorio> ~/squad-academy
cd ~/squad-academy
```

Sem repositório (envio direto da máquina de desenvolvimento):

```bash
rsync -av --progress \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude prisma/data --exclude public/uploads --exclude .env \
  ./ usuario@192.168.0.10:~/squad-academy/
```

> O projeto vai sem `node_modules`, `.next`, banco local e uploads — a imagem é construída no servidor.

---

## 3. Configurar `.env.production`

```bash
cd ~/squad-academy
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Valores mínimos:

```env
DATABASE_URL="file:./prisma/data/dev.db"
STORAGE_PROVIDER="local"
ADMIN_EMAIL="admin@seudominio.local"
ADMIN_PASSWORD="uma-senha-forte"
SESSION_SECRET="<openssl rand -hex 32>"
NEXT_PUBLIC_SITE_URL="http://192.168.0.10:3000"
```

Gerar o segredo:

```bash
openssl rand -hex 32
```

Gerar hash bcrypt (recomendado em produção; tem prioridade sobre `ADMIN_PASSWORD`):

```bash
cd ~/squad-academy
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate \
  node -e "require('bcryptjs').hash('SUA_SENHA', 10).then(console.log)"
```

Copie o resultado para `ADMIN_PASSWORD_HASH` e **deixe `ADMIN_PASSWORD` vazio**.

> `NEXT_PUBLIC_SITE_URL` entra no bundle. Se mudar IP/domínio/HTTPS depois, é preciso refazer o build.

---

## 4. Primeiro deploy

```bash
cd ~/squad-academy

# 1) constrói a imagem de produção
docker compose -f docker-compose.prod.yml build

# 2) cria/sincroniza as tabelas no volume
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate

# 3) conteúdo inicial (opcional, idempotente)
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate npx prisma db seed

# 4) sobe e acompanha
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

Saída esperada do passo 4: `web` com status `Up (healthy)` (o healthcheck pode levar ~20s).

---

## 5. Verificação pós-deploy

```bash
# healthcheck direto no container
docker compose -f docker-compose.prod.yml exec web \
  node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>r.text()).then(console.log)"

# do host
curl -s http://localhost:3000/api/health
```

Checklist funcional (no navegador):

- [ ] `/` carrega com tema escuro e trilhas
- [ ] `/artigos` lista e filtra por nível/categoria
- [ ] `/artigos/<slug>` renderiza o Markdown
- [ ] `/busca?q=FOB` retorna resultados
- [ ] `/manuais` lista o acervo
- [ ] `/admin` sem sessão redireciona para `/admin/login`
- [ ] login com as credenciais do `.env.production` entra no painel
- [ ] `/admin/manuais/novo` envia um PDF (≤ 20 MB) + capa e o manual aparece na lista
- [ ] botão **Visualizar/Baixar** abre o PDF e incrementa o contador
- [ ] logout encerra a sessão

---

## 6. Rede e acesso

### Acesso direto na LAN

`http://IP_DO_SERVIDOR:3000` — libere a porta no firewall (passo 1).

### Atrás de Nginx (recomendado para domínio/HTTPS)

1. Restrinja a porta da app ao loopback, editando `docker-compose.prod.yml`:

```yaml
ports:
  - "127.0.0.1:3000:3000"
```

2. `/etc/nginx/sites-available/squad-academy`:

```nginx
server {
    listen 80;
    server_name squad.seudominio.com;

    client_max_body_size 25m;   # PDFs de até 20 MB + overhead

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
    }
}
```

3. Ative, valide e recarregue:

```bash
sudo ln -s /etc/nginx/sites-available/squad-academy /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

4. HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d squad.seudominio.com
```

5. Atualize `NEXT_PUBLIC_SITE_URL="https://squad.seudominio.com"` e **refaça o build** (seção 7).

> Se aparecer `Invalid Server Actions request` atrás de proxy, confirme o
> `X-Forwarded-Host`/`Host` no Nginx — o Next valida a origem das Server Actions.

---

## 7. Atualizar a aplicação

```bash
cd ~/squad-academy

# faça o backup antes de qualquer update que mexa em schema (seção 8)
git pull                     # ou rsync novamente
docker compose -f docker-compose.prod.yml build

# aplica mudanças de schema (se houver)
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate

docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

Se o `db push` recusar a alteração por risco de perda de dados (ele pede
`--accept-data-loss`), **pare**, faça backup e avalie a mudança. Só então:

```bash
docker compose -f docker-compose.prod.yml --profile tools run --rm migrate \
  npx prisma db push --accept-data-loss
```

### Rollback

1. Volte o código para o commit anterior:
   ```bash
   git log --oneline -5
   git checkout <commit-anterior>
   ```
2. Rebuild e suba:
   ```bash
   docker compose -f docker-compose.prod.yml build
   docker compose -f docker-compose.prod.yml up -d
   ```
3. Se o schema mudou de forma incompatível, restaure o banco do backup (seção 8).

> Os dados continuam nos volumes; o rollback de imagem não os toca.

---

## 8. Backup e restauração

Nomes de volume do compose: `squad-academy_sqlite_data` e `squad-academy_uploads`.

```bash
cd ~/squad-academy
mkdir -p backups

# banco SQLite
docker run --rm \
  -v squad-academy_sqlite_data:/data \
  -v "$PWD/backups":/backup \
  alpine tar czf /backup/db-$(date +%F-%H%M).tar.gz -C /data .

# uploads (PDFs e capas)
docker run --rm \
  -v squad-academy_uploads:/data \
  -v "$PWD/backups":/backup \
  alpine tar czf /backup/uploads-$(date +%F-%H%M).tar.gz -C /data .
```

Verificar conteúdo:

```bash
tar tzf backups/db-*.tar.gz | head
```

Restaurar (pare a app antes):

```bash
docker compose -f docker-compose.prod.yml down

docker run --rm \
  -v squad-academy_sqlite_data:/data \
  -v "$PWD/backups":/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/db-AAAA-MM-DD-HHMM.tar.gz -C /data && chown -R 1001:1001 /data"

docker compose -f docker-compose.prod.yml up -d
```

> Automatize com `cron` diário e copie os `.tar.gz` para fora do servidor.

---

## 9. Operação do dia a dia

```bash
# status e saúde
docker compose -f docker-compose.prod.yml ps

# logs em tempo real
docker compose -f docker-compose.prod.yml logs -f web

# reiniciar
docker compose -f docker-compose.prod.yml restart web

# parar sem perder dados
docker compose -f docker-compose.prod.yml down

# shell no container (debug)
docker compose -f docker-compose.prod.yml exec web sh
```

### Limpar imagens antigas (opcional)

```bash
docker image prune -f
docker builder prune -f --filter until=168h
```

---

## 10. Segurança

- `.env.production` com `chmod 600` e fora do Git.
- Prefira `ADMIN_PASSWORD_HASH` e senha longa/única.
- `SESSION_SECRET` diferente por ambiente; trocar invalida todas as sessões.
- Não exponha `/admin` sem HTTPS fora da LAN.
- Mantenha o SO e as imagens base atualizados (`docker compose build --pull`).
- Backup fora do servidor (os volumes não protegem contra perda do disco).
- Porta 3000 publicada só em `127.0.0.1` quando houver proxy reverso.

---

## 11. Troubleshooting

| Sintoma | Diagnóstico / correção |
|---|---|
| `P1001`/erro de conexão no build ou migrate | `DATABASE_URL` do `.env.production` está correta? O arquivo está no diretório do compose? |
| Páginas com `no such table` | Rode o serviço `migrate` (seção 7) |
| `readonly database` ou erro ao contador de downloads | Dono do `dev.db` ≠ uid 1001; rode o `migrate` (ele faz `chown -R 1001:1001`) |
| `EADDRINUSE :3000` | Outra app na porta: `sudo ss -lptn 'sport = :3000'` |
| Nginx 502 | Container parado ou porta errada; veja `docker compose ... logs web` |
| Nginx 413 ao enviar PDF | Aumente `client_max_body_size` (≥ 25m) e recarregue o Nginx |
| Login sempre inválido | Confira `ADMIN_EMAIL`/`ADMIN_PASSWORD(_HASH)` e recrie o container (`up -d --force-recreate`) |
| Sessão cai após reiniciar | `SESSION_SECRET` vazio ou alterado |
| `next start` avisa sobre `standalone` | Esperado; em produção use o container (`node server.js`) |
| PDFs de exemplo retornam 404 | Normal: envie um manual real no `/admin/manuais/novo` |
| Página com dados antigos após edição | `revalidatePath` já é chamado nas actions; verifique se o build é o mais recente |

---

## 12. Apêndice — systemd (sem Docker)

```bash
cd ~/squad-academy
npm ci
npm run build
```

`/etc/systemd/system/squad-academy.service`:

```ini
[Unit]
Description=Squad Academy
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/USUARIO/squad-academy
EnvironmentFile=/home/USUARIO/squad-academy/.env.production
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=0.0.0.0
ExecStart=/usr/bin/npx next start
Restart=always
RestartSec=5
User=USUARIO

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now squad-academy
sudo systemctl status squad-academy
```

Nesse modo, garanta que `prisma/data/` e `public/uploads/` existam, pertençam ao usuário do
serviço e estejam no backup.
