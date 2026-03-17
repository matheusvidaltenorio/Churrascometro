export type AudienceType = 'leve' | 'moderado' | 'pesado';

export interface BarbecueInput {
  peopleCount: number;
  durationHours: number;
  audienceType: AudienceType;
  menCount: number;
  womenCount: number;
  childrenCount: number;
  includeAlcohol: boolean;
}

export interface MeatBreakdown {
  bovina: number;
  frango: number;
  linguica: number;
}

export interface BarbecueResult {
  totalMeatKg: number;
  beerLiters: number;
  sodaLiters: number;
  charcoalKg: number;
  iceKg: number;
  meatBreakdown?: MeatBreakdown;
  shoppingList: string[];
}
