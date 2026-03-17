/**
 * Migrations - Cria as tabelas do banco
 *
 * Execute: npm run db:migrate
 * Com retry para Render (banco pode demorar no cold start).
 */

import { pool } from '../config/database';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const runMigrations = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS barbecues (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        people_count INTEGER NOT NULL,
        duration_hours DECIMAL(4,2) NOT NULL,
        audience_type VARCHAR(20) NOT NULL,
        men_count INTEGER NOT NULL DEFAULT 0,
        women_count INTEGER NOT NULL DEFAULT 0,
        children_count INTEGER NOT NULL DEFAULT 0,
        include_alcohol BOOLEAN NOT NULL DEFAULT true,
        calculation_result JSONB NOT NULL,
        share_token VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_barbecues_share_token ON barbecues(share_token)
    `);

    console.log('✅ Migrations executadas com sucesso!');
  } finally {
    client.release();
  }
};

const migrate = async (attempt = 1): Promise<void> => {
  try {
    await runMigrations();
    await pool.end();
  } catch (error) {
    console.error(`❌ Tentativa ${attempt}/${MAX_RETRIES} falhou:`, (error as Error).message);

    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Aguardando ${RETRY_DELAY_MS / 1000}s antes de tentar novamente...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return migrate(attempt + 1);
    }

    console.error('❌ Migrations falharam após todas as tentativas');
    await pool.end();
    throw error;
  }
};

migrate();
