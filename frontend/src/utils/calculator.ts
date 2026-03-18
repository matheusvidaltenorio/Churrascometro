/**
 * Lógica de Cálculo do Churrascômetro (client-side)
 *
 * 1. Pessoas efetivas = Homens + Mulheres + (Crianças × 0.5)
 * 2. Carne: 400g (leve), 500g (moderado), 700g (pesado)
 * 3. Cerveja: 1.75L por adulto | Refrigerante: 500ml por pessoa
 * 4. Carvão: 1kg/4 pessoas | Gelo: 1kg/5 pessoas
 * 5. Duração > 6h: +20% | Público pesado: +30% bebidas
 */

import type { BarbecueInput, BarbecueResult, MeatBreakdown, PerPersonInfo } from '../types/barbecue';
import { formatarNumeroExibicao } from './formatarNumero';

const MEAT_PER_PERSON = { leve: 400, moderado: 500, pesado: 700 } as const;
const BEER_PER_ADULT = 1.75;
const SODA_PER_PERSON_ML = 500;
const CHARCOAL_PER_PEOPLE = 4;
const ICE_PER_PEOPLE = 5;
const CHILDREN_FACTOR = 0.5;
const LONG_EVENT_BONUS = 1.2;
const HEAVY_DRINK_BONUS = 1.3;
const MEAT_BREAKDOWN = { bovina: 0.4, frango: 0.3, linguica: 0.3 } as const;

/** Garante que valor é número (evita concatenação de string) */
function toNum(v: unknown): number {
  const n = Number(v);
  return isFinite(n) && !isNaN(n) ? n : 0;
}

/** Precisão: 2 casas decimais */
function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function calculateBarbecue(input: BarbecueInput): BarbecueResult {
  const men = Math.max(0, Math.floor(toNum(input.menCount)));
  const women = Math.max(0, Math.floor(toNum(input.womenCount)));
  const children = Math.max(0, Math.floor(toNum(input.childrenCount)));
  const effectivePeople = Math.max(0.5, men + women + children * CHILDREN_FACTOR);
  const adults = men + women;

  const meatPerPerson = MEAT_PER_PERSON[input.audienceType] ?? 500;
  const durationMultiplier = toNum(input.durationHours) > 6 ? LONG_EVENT_BONUS : 1;

  let totalMeatG = effectivePeople * meatPerPerson * durationMultiplier;
  let beerLiters = input.includeAlcohol ? adults * BEER_PER_ADULT * durationMultiplier : 0;
  let sodaLiters = (effectivePeople * SODA_PER_PERSON_ML) / 1000 * durationMultiplier;
  let charcoalKg = (effectivePeople / CHARCOAL_PER_PEOPLE) * durationMultiplier;
  let iceKg = (effectivePeople / ICE_PER_PEOPLE) * durationMultiplier;

  if (input.audienceType === 'pesado') {
    beerLiters *= HEAVY_DRINK_BONUS;
    sodaLiters *= HEAVY_DRINK_BONUS;
  }

  const totalMeatKg = round2(Math.min(999, Math.ceil((totalMeatG / 1000) * 10) / 10));
  charcoalKg = round2(Math.min(999, Math.ceil(charcoalKg * 10) / 10));
  iceKg = round2(Math.min(999, Math.ceil(iceKg * 10) / 10));
  beerLiters = round2(Math.min(999, Math.ceil(beerLiters * 10) / 10));
  sodaLiters = round2(Math.min(999, Math.ceil(sodaLiters * 10) / 10));

  const meatBreakdown: MeatBreakdown = {
    bovina: round2(Math.min(999, totalMeatKg * MEAT_BREAKDOWN.bovina)),
    frango: round2(Math.min(999, totalMeatKg * MEAT_BREAKDOWN.frango)),
    linguica: round2(Math.min(999, totalMeatKg * MEAT_BREAKDOWN.linguica)),
  };

  const shoppingList: string[] = [
    `🥩 Carne bovina: ${formatarNumeroExibicao(meatBreakdown.bovina)} kg`,
    `🍗 Frango: ${formatarNumeroExibicao(meatBreakdown.frango)} kg`,
    `🌭 Linguiça: ${formatarNumeroExibicao(meatBreakdown.linguica)} kg`,
  ];
  if (input.includeAlcohol && beerLiters > 0) shoppingList.push(`🍺 Cerveja: ${formatarNumeroExibicao(beerLiters)} L`);
  shoppingList.push(
    `🥤 Refrigerante/água: ${formatarNumeroExibicao(sodaLiters)} L`,
    `🔥 Carvão: ${formatarNumeroExibicao(charcoalKg)} kg`,
    `🧊 Gelo: ${formatarNumeroExibicao(iceKg)} kg`
  );

  const perPerson: PerPersonInfo = {
    meatG: round2(effectivePeople > 0 ? totalMeatG / effectivePeople : 0),
    beerL: adults > 0 && input.includeAlcohol ? round2(beerLiters / adults) : 0,
    sodaL: round2(effectivePeople > 0 ? sodaLiters / effectivePeople : 0),
    charcoalG: round2(effectivePeople > 0 ? (charcoalKg * 1000) / effectivePeople : 0),
    iceG: round2(effectivePeople > 0 ? (iceKg * 1000) / effectivePeople : 0),
  };

  return {
    totalMeatKg,
    beerLiters,
    sodaLiters,
    charcoalKg,
    iceKg,
    meatBreakdown,
    shoppingList,
    effectivePeople: round2(effectivePeople),
    perPerson,
  };
}

export function encodeShareData(data: { result: BarbecueResult; name?: string; peopleCount: number; durationHours: number }): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

export function decodeShareData(encoded: string): { result: BarbecueResult; name?: string; peopleCount: number; durationHours: number } | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as {
      result: BarbecueResult;
      name?: string;
      peopleCount: number;
      durationHours: number;
    };
  } catch {
    return null;
  }
}
