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

const MEAT_PER_PERSON = { leve: 400, moderado: 500, pesado: 700 } as const;
const BEER_PER_ADULT = 1.75;
const SODA_PER_PERSON_ML = 500;
const CHARCOAL_PER_PEOPLE = 4;
const ICE_PER_PEOPLE = 5;
const CHILDREN_FACTOR = 0.5;
const LONG_EVENT_BONUS = 1.2;
const HEAVY_DRINK_BONUS = 1.3;
const MEAT_BREAKDOWN = { bovina: 0.4, frango: 0.3, linguica: 0.3 } as const;

export function calculateBarbecue(input: BarbecueInput): BarbecueResult {
  const effectivePeople = input.menCount + input.womenCount + input.childrenCount * CHILDREN_FACTOR;
  const adults = input.menCount + input.womenCount;

  const meatPerPerson = MEAT_PER_PERSON[input.audienceType];
  let totalMeatG = effectivePeople * meatPerPerson;
  let beerLiters = input.includeAlcohol ? adults * BEER_PER_ADULT : 0;
  let sodaLiters = (effectivePeople * SODA_PER_PERSON_ML) / 1000;
  let charcoalKg = effectivePeople / CHARCOAL_PER_PEOPLE;
  let iceKg = effectivePeople / ICE_PER_PEOPLE;

  const durationMultiplier = input.durationHours > 6 ? LONG_EVENT_BONUS : 1;
  totalMeatG *= durationMultiplier;
  beerLiters *= durationMultiplier;
  sodaLiters *= durationMultiplier;
  charcoalKg *= durationMultiplier;
  iceKg *= durationMultiplier;

  if (input.audienceType === 'pesado') {
    beerLiters *= HEAVY_DRINK_BONUS;
    sodaLiters *= HEAVY_DRINK_BONUS;
  }

  const totalMeatKg = Math.ceil((totalMeatG / 1000) * 10) / 10;
  charcoalKg = Math.ceil(charcoalKg * 10) / 10;
  iceKg = Math.ceil(iceKg * 10) / 10;
  beerLiters = Math.ceil(beerLiters * 10) / 10;
  sodaLiters = Math.ceil(sodaLiters * 10) / 10;

  const meatBreakdown: MeatBreakdown = {
    bovina: Math.ceil((totalMeatKg * MEAT_BREAKDOWN.bovina) * 10) / 10,
    frango: Math.ceil((totalMeatKg * MEAT_BREAKDOWN.frango) * 10) / 10,
    linguica: Math.ceil((totalMeatKg * MEAT_BREAKDOWN.linguica) * 10) / 10,
  };

  const shoppingList: string[] = [
    `🥩 Carne bovina: ${meatBreakdown.bovina} kg`,
    `🍗 Frango: ${meatBreakdown.frango} kg`,
    `🌭 Linguiça: ${meatBreakdown.linguica} kg`,
  ];
  if (input.includeAlcohol && beerLiters > 0) shoppingList.push(`🍺 Cerveja: ${beerLiters} L`);
  shoppingList.push(`🥤 Refrigerante/água: ${sodaLiters} L`, `🔥 Carvão: ${charcoalKg} kg`, `🧊 Gelo: ${iceKg} kg`);

  const perPerson: PerPersonInfo = {
    meatG: Math.round((totalMeatG / effectivePeople) * 10) / 10,
    beerL: adults > 0 && input.includeAlcohol ? Math.round((beerLiters / adults) * 100) / 100 : 0,
    sodaL: Math.round((sodaLiters / effectivePeople) * 100) / 100,
    charcoalG: Math.round((charcoalKg * 1000 / effectivePeople) * 10) / 10,
    iceG: Math.round((iceKg * 1000 / effectivePeople) * 10) / 10,
  };

  return {
    totalMeatKg,
    beerLiters,
    sodaLiters,
    charcoalKg,
    iceKg,
    meatBreakdown,
    shoppingList,
    effectivePeople,
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
