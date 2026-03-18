# Deploy no Render - Churrascômetro

**Static Site puro** — sem banco, sem backend. Tudo roda no navegador.

---

## Configuração

1. **New +** → **Static Site**
2. Repositório: **Churrascometro**
3. **Root Directory:** `frontend`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `dist`
6. **Redirects/Rewrites:** Source `/*` → Destination `/index.html` (Rewrite)

---

## Variáveis de ambiente

Nenhuma. O app funciona sem configuração.

---

## Como funciona

- **Calcular:** Cálculo no navegador
- **Compartilhar:** Link com dados codificados na URL — nada é salvo
- **Copiar lista / Exportar PDF:** Funcionam na hora, depois some
