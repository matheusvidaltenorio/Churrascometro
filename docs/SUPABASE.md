# Configurar Supabase - Churrascômetro

O Churrascômetro usa [Supabase](https://supabase.com) como banco PostgreSQL. Plano gratuito com 500MB.

---

## Passo 1: Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name:** churrascometro (ou outro)
   - **Database Password:** crie uma senha forte e **guarde**
   - **Region:** escolha a mais próxima (ex: South America - São Paulo)
4. Clique em **Create new project** e aguarde ~2 minutos

---

## Passo 2: Obter a Connection String

1. No projeto criado, vá em **Project Settings** (ícone de engrenagem)
2. Menu lateral: **Database**
3. Role até **Connection string**
4. Selecione **URI** e copie a string

Formato típico:
```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

5. **Substitua** `[YOUR-PASSWORD]` pela senha que você criou no passo 1

---

## Passo 3: Usar no projeto

### Desenvolvimento local

Crie/edite `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.[ref]:[senha]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
PORT=3001
NODE_ENV=development
```

### Deploy no Render

1. No **churrascometro-api** → **Environment**
2. Adicione **DATABASE_URL** com a connection string do Supabase
3. Salve (o deploy será disparado)

---

## Passo 4: Rodar as migrations

As tabelas são criadas automaticamente no primeiro deploy (comando `npm run db:migrate`).

Para rodar manualmente (local):

```bash
cd backend
npm run db:migrate
```

---

## Connection Pooler vs Direct

Supabase oferece duas portas:

| Porta | Modo | Uso |
|-------|------|-----|
| **6543** | Transaction (pooler) | Recomendado para APIs serverless/persistentes |
| **5432** | Direct | Migrations, queries longas |

Use a **porta 6543** (pooler) na `DATABASE_URL` para o Churrascômetro.

---

## Observações

- **SSL:** Já habilitado por padrão no Supabase
- **Tabelas:** O migrate cria `barbecues` automaticamente
- **Free tier:** 500MB, 2 projetos, conexões ilimitadas (com pooler)
