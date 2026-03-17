/**
 * Rotas da API de Churrasco
 *
 * RESTful:
 * POST /api/barbecue/calculate - Calcula (sem salvar)
 * POST /api/barbecue - Salva e retorna cálculo
 * GET /api/barbecue/share/:token - Busca churrasco compartilhado
 */

import { Router, Request, Response } from 'express';
import { pool } from '../../config/database';
import { calculateBarbecue } from './barbecue.service';
import type { BarbecueInput } from './barbecue.types';
import crypto from 'node:crypto';

export const barbecueRouter = Router();

// Validação simples do input
function validateInput(body: unknown): body is BarbecueInput {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.peopleCount === 'number' &&
    typeof b.durationHours === 'number' &&
    ['leve', 'moderado', 'pesado'].includes(b.audienceType as string) &&
    typeof b.menCount === 'number' &&
    typeof b.womenCount === 'number' &&
    typeof b.childrenCount === 'number' &&
    typeof b.includeAlcohol === 'boolean'
  );
}

// POST /api/barbecue/calculate - Apenas calcula
barbecueRouter.post('/calculate', (req: Request, res: Response) => {
  if (!validateInput(req.body)) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const result = calculateBarbecue(req.body as BarbecueInput);
  res.json(result);
});

// POST /api/barbecue - Salva e retorna
barbecueRouter.post('/', async (req: Request, res: Response) => {
  if (!validateInput(req.body)) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const input = req.body as BarbecueInput & { name?: string };
  const result = calculateBarbecue(input);
  const shareToken = crypto.randomBytes(8).toString('hex');

  try {
    const { rows } = await pool.query(
      `INSERT INTO barbecues (
        name, people_count, duration_hours, audience_type,
        men_count, women_count, children_count, include_alcohol,
        calculation_result, share_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, share_token, created_at`,
      [
        input.name || null,
        input.peopleCount,
        input.durationHours,
        input.audienceType,
        input.menCount,
        input.womenCount,
        input.childrenCount,
        input.includeAlcohol,
        JSON.stringify(result),
        shareToken,
      ]
    );

    res.status(201).json({
      ...result,
      id: rows[0].id,
      shareToken: rows[0].share_token,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${rows[0].share_token}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar churrasco' });
  }
});

// GET /api/barbecue/share/:token
barbecueRouter.get('/share/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT calculation_result, name, people_count, duration_hours, created_at FROM barbecues WHERE share_token = $1',
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Churrasco não encontrado' });
    }

    res.json({
      ...rows[0].calculation_result,
      name: rows[0].name,
      peopleCount: rows[0].people_count,
      durationHours: rows[0].duration_hours,
      createdAt: rows[0].created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar churrasco' });
  }
});
