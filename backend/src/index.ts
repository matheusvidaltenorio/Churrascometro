/**
 * Churrascômetro - API Backend
 *
 * Ponto de entrada da aplicação. Configura Express, CORS e rotas.
 * Por que Express? Simples, flexível e amplamente usado - ideal para APIs REST.
 */

import express from 'express';
import cors from 'cors';
import { barbecueRouter } from './modules/barbecue/barbecue.routes';
import { healthRouter } from './modules/health/health.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: '*' })); // Em produção, especifique o domínio do frontend
app.use(express.json());

// Rotas
app.use('/api/health', healthRouter);
app.use('/api/barbecue', barbecueRouter);

// Rota raiz
app.get('/', (_, res) => {
  res.json({
    name: 'Churrascômetro API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Churrascômetro API rodando em http://localhost:${PORT}`);
});
