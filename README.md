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
- 📤 Compartilhar churrasco (link)
- 📝 Gerar lista de compras
- 💾 Salvar churrasco (requer conta)
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
| **PostgreSQL** | Banco relacional robusto, gratuito, suporta JSON, escalável para dados estruturados |

### Alternativas consideradas
- **NestJS** vs Express: NestJS tem mais estrutura (módulos, injeção), mas Express é mais didático para iniciantes
- **MongoDB** vs PostgreSQL: PostgreSQL escolhido para relacionamentos (usuários, churrascos salvos)

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
[Usuário] → [Formulário React] → [API REST] → [Lógica de Cálculo] → [Resposta JSON]
                                    ↓
                              [PostgreSQL] (salvar churrasco)
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
- PostgreSQL 14+ (ou Docker)
- npm ou yarn

### 1. Clone e instale dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure o banco de dados

**Local:** PostgreSQL ou Docker.

**Deploy:** Use [Supabase](https://supabase.com) — ver [docs/SUPABASE.md](docs/SUPABASE.md).

Crie `backend/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/churrascometro
NODE_ENV=development
```

### 3. Execute as migrations

```bash
cd backend
npm run db:migrate
```

### 4. Inicie os servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

> **Nota:** A calculadora funciona mesmo sem PostgreSQL! O botão "Calcular" não precisa do banco. Apenas "Salvar e compartilhar" e links compartilhados requerem o banco rodando.

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

## ☁️ Deploy no Render + Supabase

O projeto está pronto para deploy:

1. **Banco:** Crie um projeto no [Supabase](https://supabase.com) — [docs/SUPABASE.md](docs/SUPABASE.md)
2. **App:** Conecte o repositório no [Render](https://render.com) e use o Blueprint
3. Documentação completa: **[docs/DEPLOY-RENDER.md](docs/DEPLOY-RENDER.md)**

---

## 📄 Licença

MIT - Livre para uso e modificação.
