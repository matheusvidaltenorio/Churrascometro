/**
 * Migrations - Cria as tabelas do banco
 *
 * Execute: npm run db:migrate
 * Em produção, use ferramentas como Knex ou TypeORM para migrations versionadas.
 */

import { pool } from '../config/database';

const migrate = async () => {
  const client = await pool.connect();

  try {
    // Tabela de churrascos salvos
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

    // Índice para busca por token de compartilhamento
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_barbecues_share_token ON barbecues(share_token)
    `);

    console.log('✅ Migrations executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro nas migrations:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
