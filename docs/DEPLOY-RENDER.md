# Deploy no Render - Churrascômetro

Guia passo a passo para colocar o Churrascômetro no ar usando [Render](https://render.com) + [Supabase](https://supabase.com).

---

## Pré-requisitos

- Conta no [Render](https://render.com) (gratuita)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Repositório no GitHub conectado

---

## Passo 0: Configurar Supabase (banco de dados)

**Antes do deploy**, crie o banco no Supabase.

> **Migrando do Render Postgres?** O Blueprint não usa mais o banco do Render. Crie o Supabase, adicione `DATABASE_URL` no backend e faça um novo deploy. Os dados do banco antigo não são migrados automaticamente.

1. Siga o guia **[docs/SUPABASE.md](SUPABASE.md)** para criar o projeto
2. Copie a **Connection String** (porta 6543 - pooler)
3. Guarde para usar no Passo 3

---

## Opção 1: Blueprint Automático (recomendado)

### Passo 1: Conectar o repositório

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub (se ainda não conectou)
4. Selecione o repositório **Churrascometro**
5. O Render detectará o `render.yaml` na raiz

### Passo 2: Aplicar o Blueprint

1. Clique em **"Apply"**
2. O Render criará:
   - **churrascometro-api** (backend)
   - **churrascometro-web** (frontend)

### Passo 3: Configurar variáveis

O Blueprint pedirá 3 variáveis. Preencha:

**No backend (churrascometro-api):**
1. **DATABASE_URL** = Connection string do Supabase (ex: `postgresql://postgres.xxx:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`)
2. **FRONTEND_URL** = URL do frontend (ex: `https://churrascometro-web.onrender.com`)

**No frontend (churrascometro-web):**
1. **VITE_API_URL** = URL do backend (ex: `https://churrascometro-api.onrender.com`)

**Ordem recomendada:**
1. Faça o Apply
2. Adicione **DATABASE_URL** no backend com a string do Supabase → Save
3. Aguarde o deploy do backend
4. Copie a URL do backend e adicione **VITE_API_URL** no frontend → Save
5. Copie a URL do frontend e adicione **FRONTEND_URL** no backend → Save

### Passo 4: Rewrite para SPA (se necessário)

Se as rotas `/calcular`, `/resultado`, `/share/:token` retornarem 404:

1. Vá em **churrascometro-web** → **Settings**
2. **Redirects/Rewrites** → **Add Rule**
3. **Source:** `/*`
4. **Destination:** `/index.html`
5. **Type:** Rewrite

---

## Opção 2: Deploy manual (serviço por serviço)

### 1. Deploy do Backend

1. **New +** → **Web Service**
2. Conecte o repositório **Churrascometro**
3. Configurações:
   - **Name:** churrascometro-api
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm run db:migrate && npm start`

4. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = Connection string do Supabase
   - `FRONTEND_URL` = (URL do frontend após criar)

5. **Create Web Service**

### 2. Deploy do Frontend

1. **New +** → **Static Site**
2. Conecte o repositório **Churrascometro**
3. Configurações:
   - **Name:** churrascometro-web
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables:**
   - `VITE_API_URL` = URL do backend

5. **Redirects/Rewrites:** Source `/*` → Destination `/index.html` (Rewrite)

6. **Create Static Site**

### 3. Atualizar FRONTEND_URL no backend

Volte no **churrascometro-api** e atualize `FRONTEND_URL` com a URL real do frontend.

---

## URLs finais

| Serviço | URL típica |
|---------|------------|
| Frontend | `https://churrascometro-web.onrender.com` |
| Backend API | `https://churrascometro-api.onrender.com` |
| Banco | Supabase Dashboard |

---

## Troubleshooting

### Erro de conexão com o banco

1. **Supabase:** Use a connection string da porta **6543** (pooler)
2. **Senha:** Substitua `[YOUR-PASSWORD]` pela senha real do projeto
3. **SSL:** Já configurado no backend para produção

### Erro "Connection terminated due to connection timeout"

- Supabase costuma responder rápido. Se persistir, verifique se a connection string está correta.

---

## Observações

- **Banco:** Supabase (PostgreSQL) - ver [docs/SUPABASE.md](SUPABASE.md)
- **Plano Free:** backend pode "dormir" após 15 min. Primeira requisição ~30s.
- **Migrations:** rodam automaticamente no `startCommand`.
