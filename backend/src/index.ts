/**
 * Churrascômetro - API + Frontend unificado
 *
 * Em produção, serve o frontend estático junto com a API.
 * Uma única URL, sem CORS, sem VITE_API_URL.
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import { barbecueRouter } from './modules/barbecue/barbecue.routes';
import { healthRouter } from './modules/health/health.routes';
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// API
app.use('/api/health', healthRouter);
app.use('/api/barbecue', barbecueRouter);

// Em produção: servir frontend estático
if (isProduction) {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));
  // SPA: todas as rotas não-API retornam index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (_, res) => {
    res.json({ name: 'Churrascômetro API', version: '1.0.0', docs: '/api/health' });
  });
}

app.listen(PORT, () => {
  console.log(`🔥 Churrascômetro rodando em http://localhost:${PORT}`);
});
