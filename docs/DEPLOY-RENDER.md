# Deploy no Render - Churrascômetro

**Deploy unificado:** API + Frontend em um único serviço. Sem CORS, sem VITE_API_URL.

---

## Pré-requisitos

- Conta no [Render](https://render.com)
- Banco: [Supabase](https://supabase.com) ou Render Postgres
- Repositório no GitHub conectado

---

## Passo 1: Configurar o banco

**Supabase:** Siga [docs/SUPABASE.md](SUPABASE.md) e copie a Connection String.

**Render Postgres:** Crie o banco, copie a **Internal Database URL**.

---

## Passo 2: Deploy

### Opção A: Blueprint

1. **New +** → **Blueprint**
2. Conecte o repositório **Churrascometro**
3. **Apply**
4. Adicione **DATABASE_URL** no serviço **churrascometro** → Save

### Opção B: Manual

1. **New +** → **Web Service**
2. Repositório: **Churrascometro**
3. **Root Directory:** `.` (raiz do projeto)
4. **Build Command:** `npm run build`
5. **Start Command:** `npm start`
6. **Environment:** `NODE_ENV` = `production`, `DATABASE_URL` = (sua connection string)
7. **Create**

---

## Resultado

Uma única URL serve tudo:
- `/` → Frontend (React)
- `/calcular`, `/resultado`, `/share/:token` → Frontend
- `/api/*` → API

Exemplo: `https://churrascometro.onrender.com`

---

## Migrando do deploy antigo (2 serviços)

Se você tinha **churrascometro-api** e **churrascometro-web** separados:

1. Crie um novo **Web Service** com as configs acima (rootDir: `.`, build: `npm run build`)
2. Adicione **DATABASE_URL**
3. Após funcionar, pode remover os serviços antigos
