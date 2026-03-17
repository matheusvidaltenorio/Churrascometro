/**
 * Health Check - Verifica se a API está funcionando
 *
 * Útil para monitoramento e load balancers.
 */

import { Router } from 'express';
import { pool } from '../../config/database';

export const healthRouter = Router();

healthRouter.get('/', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
