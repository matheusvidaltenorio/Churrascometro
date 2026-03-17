# Troubleshooting - Churrascômetro

## "Failed to fetch" ao clicar em Calcular ou Salvar

### Solução: Deploy unificado (recomendado)

O projeto agora usa **um único serviço** que serve frontend + API. Não precisa mais de VITE_API_URL.

**Se você tem 2 serviços (Static Site + Web Service):**

1. Crie um **novo Web Service** no Render
2. Repositório: Churrascometro
3. **Root Directory:** `.` (raiz)
4. **Build Command:** `npm run build`
5. **Start Command:** `npm start`
6. **Environment:** `DATABASE_URL` = sua connection string (Supabase ou Render Postgres)
7. Após funcionar, remova os serviços antigos

**Se você tem 1 serviço (Static Site):**

1. Crie um **Web Service** (não Static Site) com as configs acima
2. O Web Service serve o frontend e a API na mesma URL
