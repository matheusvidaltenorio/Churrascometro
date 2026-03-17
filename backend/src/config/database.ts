/**
 * Configuração do PostgreSQL
 *
 * Usamos o driver 'pg' (node-postgres) - o mais popular para Node.js.
 * Pool de conexões permite reutilizar conexões, melhorando performance.
 *
 * Render: SSL obrigatório, timeout maior para cold start do banco.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/churrascometro',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // 15s - Render pode demorar no cold start
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Testa conexão ao iniciar
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool do PostgreSQL:', err.message);
});
