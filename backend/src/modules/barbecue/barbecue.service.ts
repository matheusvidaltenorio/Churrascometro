/**
 * Lógica de Cálculo do Churrascômetro
 *
 * REGRAS DE NEGÓCIO (documentadas para fácil manutenção):
 *
 * 1. Pessoas efetivas = Homens + Mulheres + (Crianças × 0.5)
 * 2. Carne: 400g (leve), 500g (moderado), 700g (pesado) por pessoa
 * 3. Cerveja: 1.75L por adulto (média entre 1.5 e 2L)
 * 4. Refrigerante/água: 500ml por pessoa
 * 5. Carvão: 1kg para cada 4 pessoas
 * 6. Gelo: 1kg para cada 5 pessoas
 * 7. Duração > 6h: +20% em tudo
 * 8. Público pesado: +30% em bebidas
 * 9. Tipos de carne: 40% bovina, 30% frango, 30% linguiça
 */

import type { BarbecueInput, BarbecueResult, MeatBreakdown } from './barbecue.types';

// Constantes configuráveis (fácil ajuste futuro)
const MEAT_PER_PERSON = {
  leve: 400,
  moderado: 500,
  pesado: 700,
} as const;

const BEER_PER_ADULT_LITERS = 1.75;
const SODA_PER_PERSON_ML = 500;
const CHARCOAL_PER_PEOPLE = 4; // 1kg para cada 4 pessoas
const ICE_PER_PEOPLE = 5; // 1kg para cada 5 pessoas
const CHILDREN_FACTOR = 0.5;
const LONG_EVENT_HOURS = 6;
const LONG_EVENT_BONUS = 1.2; // +20%
const HEAVY_AUDIENCE_DRINK_BONUS = 1.3; // +30%
const MEAT_BREAKDOWN = { bovina: 0.4, frango: 0.3, linguica: 0.3 } as const;

export function calculateBarbecue(input: BarbecueInput): BarbecueResult {
  // 1. Calcular pessoas efetivas (crianças = 0.5)
  const effectivePeople =
    input.menCount + input.womenCount + input.childrenCount * CHILDREN_FACTOR;

  // 2. Adultos (para cálculo de cerveja)
  const adults = input.menCount + input.womenCount;

  // 3. Carne total (gramas)
  const meatPerPerson = MEAT_PER_PERSON[input.audienceType];
  let totalMeatG = effectivePeople * meatPerPerson;

  // 4. Bebidas
  let beerLiters = input.includeAlcohol ? adults * BEER_PER_ADULT_LITERS : 0;
  let sodaLiters = (effectivePeople * SODA_PER_PERSON_ML) / 1000;

  // 5. Carvão e gelo
  let charcoalKg = effectivePeople / CHARCOAL_PER_PEOPLE;
  let iceKg = effectivePeople / ICE_PER_PEOPLE;

  // 6. Ajuste por duração > 6h
  const durationMultiplier = input.durationHours > LONG_EVENT_HOURS ? LONG_EVENT_BONUS : 1;

  totalMeatG *= durationMultiplier;
  beerLiters *= durationMultiplier;
  sodaLiters *= durationMultiplier;
  charcoalKg *= durationMultiplier;
  iceKg *= durationMultiplier;

  // 7. Ajuste público pesado (+30% bebidas)
  const drinkMultiplier = input.audienceType === 'pesado' ? HEAVY_AUDIENCE_DRINK_BONUS : 1;
  beerLiters *= drinkMultiplier;
  sodaLiters *= drinkMultiplier;

  // 8. Arredondar para valores práticos
  const totalMeatKg = Math.ceil((totalMeatG / 1000) * 10) / 10; // 1 casa decimal
  charcoalKg = Math.ceil(charcoalKg * 10) / 10;
  iceKg = Math.ceil(iceKg * 10) / 10;
  beerLiters = Math.ceil(beerLiters * 10) / 10;
  sodaLiters = Math.ceil(sodaLiters * 10) / 10;

  // 9. Breakdown de carnes
  const meatBreakdown: MeatBreakdown = {
    bovina: Math.ceil((totalMeatKg * MEAT_BREAKDOWN.bovina) * 10) / 10,
    frango: Math.ceil((totalMeatKg * MEAT_BREAKDOWN.frango) * 10) / 10,
    linguica: Math.ceil((totalMeatKg * MEAT_BREAKDOWN.linguica) * 10) / 10,
  };

  // 10. Lista de compras
  const shoppingList = buildShoppingList({
    totalMeatKg,
    beerLiters,
    sodaLiters,
    charcoalKg,
    iceKg,
    meatBreakdown,
    includeAlcohol: input.includeAlcohol,
  });

  return {
    totalMeatKg,
    beerLiters,
    sodaLiters,
    charcoalKg,
    iceKg,
    meatBreakdown,
    shoppingList,
  };
}

function buildShoppingList(params: {
  totalMeatKg: number;
  beerLiters: number;
  sodaLiters: number;
  charcoalKg: number;
  iceKg: number;
  meatBreakdown: MeatBreakdown;
  includeAlcohol: boolean;
}): string[] {
  const list: string[] = [];

  list.push(`🥩 Carne bovina: ${params.meatBreakdown.bovina} kg`);
  list.push(`🍗 Frango: ${params.meatBreakdown.frango} kg`);
  list.push(`🌭 Linguiça: ${params.meatBreakdown.linguica} kg`);

  if (params.includeAlcohol && params.beerLiters > 0) {
    list.push(`🍺 Cerveja: ${params.beerLiters} L`);
  }

  list.push(`🥤 Refrigerante/água: ${params.sodaLiters} L`);
  list.push(`🔥 Carvão: ${params.charcoalKg} kg`);
  list.push(`🧊 Gelo: ${params.iceKg} kg`);

  return list;
}
