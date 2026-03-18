# 🥩 Churrascômetro

> Descubra quanto comprar para seu churrasco sem desperdício

Aplicação web que calcula automaticamente a quantidade ideal de itens para um churrasco com base no número de pessoas, duração do evento e perfil dos convidados.

**🚀 [Acessar aplicação em produção](https://churrascometro-1.onrender.com)**

> Deploy unificado: frontend e API na mesma URL.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Como Funciona o Cálculo](#-como-funciona-o-cálculo)
- [Instalação](#-instalação)
- [Escalabilidade Futura](#-escalabilidade-futura)

---

## ✨ Funcionalidades

### Principais
- **Calculadora inteligente**: Quantidade de carne, bebidas, carvão e gelo
- **Perfil de público**: Leve, Moderado ou Pesado
- **Detalhamento por tipo**: Homens, mulheres e crianças (crianças = 0.5 pessoa)
- **Duração do evento**: Ajuste automático para churrascos longos (>6h = +20%)
- **Tipos de carne**: 40% bovina, 30% frango, 30% linguiça

### Extras
- 📤 Compartilhar (link temporário com dados na URL)
- 📝 Copiar lista de compras
- 📄 Exportar PDF

---

## 🛠 Stack Tecnológica

### Por que cada tecnologia?

| Tecnologia | Motivo da escolha |
|------------|-------------------|
| **React** | Ecossistema maduro, grande comunidade, componentes reutilizáveis, ideal para interfaces dinâmicas |
| **TypeScript** | Tipagem estática previne bugs, autocomplete melhor, documentação viva no código |
| **TailwindCSS** | Desenvolvimento rápido, design consistente, sem conflitos de CSS, fácil responsividade |
| **Node.js + Express** | JavaScript no backend (mesma linguagem), Express é simples e flexível, ideal para APIs REST |
| **React + Vite** | App estático, sem backend — roda 100% no navegador |

### Alternativas consideradas
- **Backend:** Removido — cálculo no cliente, compartilhar = dados na URL

---

## 🏗 Arquitetura

```
Churrascometro/
├── frontend/          # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── backend/           # Express + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   │   ├── barbecue/    # Cálculos e salvamento
│   │   │   └── health/      # Health check
│   │   ├── config/
│   │   └── database/
│   └── package.json
│
└── docs/              # Documentação técnica
```

### Fluxo de dados

```
[Usuário] → [Formulário React] → [Cálculo no navegador] → [Resultado]
                                 ↓
                    [Copiar] ou [Exportar PDF] ou [Compartilhar link]
```

---

## 📐 Como Funciona o Cálculo

### 1. Equivalência de pessoas
```
Pessoas efetivas = Homens + Mulheres + (Crianças × 0.5)
```
Crianças consomem menos, então contam como metade de um adulto.

### 2. Carne (gramas por pessoa)
| Perfil | Gramas/pessoa |
|--------|---------------|
| Leve   | 400g         |
| Moderado | 500g       |
| Pesado | 700g         |

### 3. Bebidas
- **Cerveja**: 1.5L a 2L por adulto (média 1.75L)
- **Refrigerante/água**: 500ml por pessoa
- Se público "Pesado" → +30% em bebidas

### 4. Carvão e Gelo
- **Carvão**: 1kg para cada 4 pessoas
- **Gelo**: 1kg para cada 5 pessoas

### 5. Ajuste por duração
Se duração > 6 horas → **+20%** em todos os itens

### 6. Tipos de carne (opcional)
- 40% Carne bovina (picanha, costela, etc.)
- 30% Frango
- 30% Linguiça

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone e instale

```bash
cd frontend
npm install
```

### 2. Rode localmente

```bash
npm run dev
```

Acesse: http://localhost:5173

> **Sem banco de dados.** Cálculo no navegador. Compartilhar = link temporário.

---

## 📈 Escalabilidade Futura

### App Mobile
- **React Native** ou **Expo**: Reutiliza lógica TypeScript
- API REST já pronta para consumo
- PWA também é opção (já responsivo)

### Inteligência Artificial
- Sugestões personalizadas baseadas em histórico
- "Churrascos similares consumiram X"
- Recomendação de receitas

### Monetização
- Premium: mais tipos de carne, planejamento de eventos
- Parcerias com açougues/mercados (links de compra)
- API paga para integrações

---

## ☁️ Deploy no Render

**Sem banco de dados.** Apenas Static Site. Cálculo no navegador, compartilhar = link com dados na URL.

1. Conecte o repositório no [Render](https://render.com)
2. **New** → **Static Site** → Repo: Churrascometro
3. **Root Directory:** `frontend` | **Build:** `npm run build` | **Publish:** `dist`
4. **Redirects:** `/*` → `/index.html` (Rewrite)

Ou use o **Blueprint** (`render.yaml`).

---

## 📄 Licença

MIT - Livre para uso e modificação.
