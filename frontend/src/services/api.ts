/**
 * Serviço de API - Comunicação com o backend
 *
 * Em desenvolvimento: usa /api (proxy do Vite)
 * Em produção: usa VITE_API_URL (ex: https://churrascometro-api.onrender.com)
 */

import type { BarbecueInput, BarbecueResult } from '../types/barbecue';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function calculateBarbecue(input: BarbecueInput): Promise<BarbecueResult> {
  const res = await fetch(`${API_BASE}/barbecue/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao calcular');
  }

  return res.json();
}

export async function saveBarbecue(
  input: BarbecueInput & { name?: string }
): Promise<BarbecueResult & { id: string; shareToken: string; shareUrl: string }> {
  const res = await fetch(`${API_BASE}/barbecue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao salvar');
  }

  return res.json();
}

export async function getSharedBarbecue(token: string): Promise<BarbecueResult & { name?: string; peopleCount: number; durationHours: number }> {
  const res = await fetch(`${API_BASE}/barbecue/share/${token}`);

  if (!res.ok) {
    if (res.status === 404) throw new Error('Churrasco não encontrado');
    throw new Error('Erro ao carregar');
  }

  return res.json();
}
