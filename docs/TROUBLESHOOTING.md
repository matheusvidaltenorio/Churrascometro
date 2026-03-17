# Troubleshooting - Churrascômetro

## "Failed to fetch" ao clicar em Calcular ou Salvar

### Causa
O frontend não consegue se comunicar com a API. Geralmente porque **VITE_API_URL** não está configurado ou está incorreto.

### Solução

1. **Encontre a URL da API** no Render:
   - Dashboard → **churrascometro-api** (ou o nome do seu Web Service)
   - Copie a URL (ex: `https://churrascometro-api.onrender.com`)

2. **Configure no frontend**:
   - Dashboard → **churrascometro-1** (ou churrascometro-web - seu Static Site)
   - **Environment** → **Add Environment Variable**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://churrascometro-api.onrender.com` (sua URL da API)
   - **Save** → o Render fará redeploy automático

3. **Aguarde o redeploy** (~2–3 minutos)

4. **Teste novamente** – o botão Calcular deve funcionar

### Verificar se a API está online

Abra no navegador: `https://sua-api.onrender.com/api/health`

- Se retornar `{"status":"ok"}` → API está funcionando
- Se der erro ou timeout → API pode estar "dormindo" (plano free). Aguarde ~30s e tente de novo

### Frontend e API são serviços diferentes

| Serviço | Tipo | URL típica |
|---------|------|------------|
| Frontend | Static Site | churrascometro-1.onrender.com |
| API | Web Service | churrascometro-api.onrender.com |

O frontend precisa da URL da API em `VITE_API_URL` para fazer as requisições.
