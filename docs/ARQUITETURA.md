# Arquitetura do Churrascômetro

## Visão Geral

O Churrascômetro é uma aplicação **full-stack** com frontend e backend separados, comunicando via API REST.

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐
│    Frontend     │ ◄────────────────► │    Backend      │
│  React + Vite  │                    │  Express + TS   │
│  localhost:5173│                    │  localhost:3001  │
└─────────────────┘                    └────────┬────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │   PostgreSQL    │
                                        │   localhost:5432│
                                        └─────────────────┘
```

## Por que essa arquitetura?

### Separação Frontend/Backend
- **Manutenção**: Equipes podem trabalhar independentemente
- **Escalabilidade**: Backend pode ser escalado separadamente
- **Reutilização**: A mesma API pode servir web, mobile, integrações

### API REST
- Padrão amplamente adotado
- Fácil de testar (Postman, curl)
- Stateless: cada requisição é independente

### PostgreSQL
- Dados estruturados (churrascos salvos, futuros usuários)
- Suporta JSONB para flexibilidade (resultado do cálculo)
- Open source e robusto

## Fluxo de Dados

### 1. Cálculo (sem salvar)
```
Usuario preenche formulário
    → POST /api/barbecue/calculate
    → barbecue.service.calculateBarbecue()
    → Retorna JSON com quantidades
    → Frontend exibe resultado
```

### 2. Salvar e Compartilhar
```
Usuario clica "Salvar e compartilhar"
    → POST /api/barbecue
    → Salva no PostgreSQL
    → Gera token único (share_token)
    → Retorna resultado + shareUrl
    → Usuario pode compartilhar link
```

### 3. Visualizar Compartilhado
```
Usuario acessa /share/abc123
    → GET /api/barbecue/share/abc123
    → Busca no banco por share_token
    → Retorna dados do churrasco
    → Frontend exibe
```

## Módulos do Backend

```
backend/src/
├── index.ts              # Entry point, configura Express
├── config/
│   └── database.ts       # Pool de conexões PostgreSQL
├── database/
│   └── migrate.ts        # Cria tabelas
└── modules/
    ├── health/           # Health check (monitoramento)
    └── barbecue/         # Lógica principal
        ├── barbecue.types.ts
        ├── barbecue.service.ts   # Regras de cálculo
        └── barbecue.routes.ts   # Endpoints REST
```

## Módulos do Frontend

```
frontend/src/
├── main.tsx
├── App.tsx               # Rotas
├── pages/
│   ├── LandingPage.tsx
│   ├── CalculatorPage.tsx
│   ├── ResultsPage.tsx
│   └── SharePage.tsx
├── services/
│   └── api.ts            # Chamadas à API
└── types/
    └── barbecue.ts
```

## Como Escalar

### App Mobile
- Usar React Native ou Expo
- Reutilizar `api.ts` (ou criar camada compartilhada)
- Mesma API, zero mudanças no backend

### PWA (Progressive Web App)
- Adicionar `manifest.json` e Service Worker
- Frontend já é responsivo
- Pode funcionar offline para cálculos (lógica no frontend)

### IA / Recomendações
- Nova rota: `POST /api/barbecue/suggestions`
- Input: histórico de churrascos do usuário
- Output: sugestões personalizadas
- Banco: tabela `user_barbecues` com feedback

### Monetização
- Tabela `users` + `subscriptions`
- Plano free: 5 churrascos salvos
- Plano premium: ilimitado, export PDF avançado, integração com mercados
