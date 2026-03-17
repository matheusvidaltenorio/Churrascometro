# Deploy no Render - Churrascômetro

Guia passo a passo para colocar o Churrascômetro no ar usando [Render](https://render.com).

---

## Pré-requisitos

- Conta no [Render](https://render.com) (gratuita)
- Repositório no GitHub já conectado

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
   - **PostgreSQL** (banco de dados)
   - **churrascometro-api** (backend)
   - **churrascometro-web** (frontend)

### Passo 3: Configurar variáveis manuais

O Blueprint pedirá valores para duas variáveis. **Deixe em branco** na primeira vez e adicione depois:

**No backend (churrascometro-api):**
1. **FRONTEND_URL** = URL do frontend (ex: `https://churrascometro-web.onrender.com`)

**No frontend (churrascometro-web):**
1. **VITE_API_URL** = URL do backend (ex: `https://churrascometro-api.onrender.com`)

**Ordem recomendada:**
1. Faça o Apply e aguarde os deploys
2. Copie a URL do **backend** (ex: `https://churrascometro-api.onrender.com`)
3. No **frontend** → Environment → adicione `VITE_API_URL` com essa URL → Save (vai redeployar)
4. Copie a URL do **frontend** (ex: `https://churrascometro-web.onrender.com`)
5. No **backend** → Environment → adicione `FRONTEND_URL` com essa URL → Save

### Passo 4: Rewrite para SPA (se necessário)

Se as rotas `/calcular`, `/resultado`, `/share/:token` retornarem 404:

1. Vá em **churrascometro-web** → **Settings**
2. **Redirects/Rewrites** → **Add Rule**
3. **Source:** `/*`
4. **Destination:** `/index.html`
5. **Type:** Rewrite

---

## Opção 2: Deploy manual (serviço por serviço)

### 1. Criar o banco PostgreSQL

1. **New +** → **PostgreSQL**
2. Nome: `churrascometro-db`
3. Plano: **Free**
4. Crie e copie a **Internal Database URL**

### 2. Deploy do Backend

1. **New +** → **Web Service**
2. Conecte o repositório **Churrascometro**
3. Configurações:
   - **Name:** churrascometro-api
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run db:migrate && npm start`

4. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (cole a Internal Database URL)
   - `FRONTEND_URL` = (será a URL do frontend, ex: `https://churrascometro-web.onrender.com`)

5. **Create Web Service**
6. Aguarde o deploy e copie a URL (ex: `https://churrascometro-api.onrender.com`)

### 3. Deploy do Frontend

1. **New +** → **Static Site**
2. Conecte o repositório **Churrascometro**
3. Configurações:
   - **Name:** churrascometro-web
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables:**
   - `VITE_API_URL` = URL do backend (ex: `https://churrascometro-api.onrender.com`)

5. **Redirects/Rewrites** (importante para React Router):
   - **Add Rule**
   - Source: `/*`
   - Destination: `/index.html`
   - Type: **Rewrite**

6. **Create Static Site**

### 4. Atualizar FRONTEND_URL no backend

Volte no **churrascometro-api** e atualize `FRONTEND_URL` com a URL real do frontend.

---

## URLs finais

| Serviço | URL típica |
|---------|------------|
| Frontend | `https://churrascometro-web.onrender.com` |
| Backend API | `https://churrascometro-api.onrender.com` |

---

## Troubleshooting

### Erro "Connection terminated due to connection timeout"

1. **Use a Internal Database URL**: No Dashboard do banco, vá em **Connect** e copie a **Internal Database URL** (não a External). Use em `DATABASE_URL`.

2. **Região**: Banco e API devem estar na mesma região (ex: Oregon).

3. **Cold start**: O banco free pode demorar para acordar. O deploy agora faz até 5 tentativas com retry automático.

---

## Observações

- **Plano Free:** o backend pode "dormir" após 15 min de inatividade. A primeira requisição pode demorar ~30s.
- **CORS:** o backend está configurado para aceitar qualquer origem (`*`).
- **Migrations:** rodam automaticamente no `startCommand` antes de iniciar o servidor.
