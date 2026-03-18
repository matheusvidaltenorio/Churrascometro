import { describe, it, expect } from 'vitest';
import {
  calculateBarbecue,
  validateBarbecueInput,
  encodeShareData,
  decodeShareData,
} from './calculator';
import { formatarNumero, formatarNumeroExibicao, formatarPeso, validarNumero } from './formatarNumero';
import type { BarbecueInput } from '../types/barbecue';

const baseInput: BarbecueInput = {
  peopleCount: 10,
  durationHours: 4,
  audienceType: 'moderado',
  menCount: 5,
  womenCount: 5,
  childrenCount: 0,
  includeAlcohol: true,
};

function makeInput(overrides: Partial<BarbecueInput>): BarbecueInput {
  return { ...baseInput, ...overrides };
}

/** Garante que nenhum valor está em notação científica, é Infinity ou NaN */
function expectNoScientificNotation(result: ReturnType<typeof calculateBarbecue>) {
  const values = [
    result.totalMeatKg,
    result.beerLiters,
    result.sodaLiters,
    result.charcoalKg,
    result.iceKg,
    result.effectivePeople,
    ...(result.meatBreakdown ? Object.values(result.meatBreakdown) : []),
    ...(result.perPerson ? Object.values(result.perPerson) : []),
  ].filter((v): v is number => typeof v === 'number');

  for (const v of values) {
    expect(isFinite(v), `Valor ${v} deve ser finito`).toBe(true);
    expect(Number.isNaN(v), `Valor ${v} não deve ser NaN`).toBe(false);
    const str = String(v);
    expect(str, `Valor ${v} não deve estar em notação científica`).not.toMatch(/e\+|e-/i);
  }
}

/** Garante que valores estão em faixa realista (ex: não 1000kg para 10 pessoas) */
function expectRealisticValues(result: ReturnType<typeof calculateBarbecue>, effectivePeople: number) {
  const maxMeatPerPersonKg = 1.5;
  expect(result.totalMeatKg).toBeLessThanOrEqual(effectivePeople * maxMeatPerPersonKg * 1.5);
  expect(result.totalMeatKg).toBeLessThanOrEqual(99999);
}

describe('calculateBarbecue', () => {
  describe('Cenários básicos - pessoas', () => {
    it('1 pessoa', () => {
      const r = calculateBarbecue(makeInput({ menCount: 1, womenCount: 0, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expectRealisticValues(r, 1);
      expect(r.totalMeatKg).toBeGreaterThan(0);
      expect(r.totalMeatKg).toBeLessThan(2);
    });

    it('2 pessoas', () => {
      const r = calculateBarbecue(makeInput({ menCount: 2, womenCount: 0, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expectRealisticValues(r, 2);
    });

    it('10 pessoas', () => {
      const r = calculateBarbecue(makeInput({ menCount: 5, womenCount: 5, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expectRealisticValues(r, 10);
      expect(r.totalMeatKg).toBeGreaterThan(4);
      expect(r.totalMeatKg).toBeLessThan(12);
    });

    it('30 pessoas', () => {
      const r = calculateBarbecue(makeInput({ menCount: 15, womenCount: 15, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expectRealisticValues(r, 30);
    });
  });

  describe('Composição - adultos e crianças', () => {
    it('apenas adultos', () => {
      const r = calculateBarbecue(makeInput({ menCount: 3, womenCount: 2, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expect(r.effectivePeople).toBe(5);
    });

    it('apenas crianças', () => {
      const r = calculateBarbecue(makeInput({ menCount: 0, womenCount: 0, childrenCount: 4 }));
      expectNoScientificNotation(r);
      expect(r.effectivePeople).toBe(2);
      expect(r.totalMeatKg).toBeGreaterThan(0);
    });

    it('misto adultos + crianças', () => {
      const r = calculateBarbecue(makeInput({ menCount: 2, womenCount: 2, childrenCount: 4 }));
      expectNoScientificNotation(r);
      expect(r.effectivePeople).toBe(6);
    });
  });

  describe('Duração', () => {
    it('2 horas', () => {
      const r = calculateBarbecue(makeInput({ durationHours: 2 }));
      expectNoScientificNotation(r);
    });

    it('5 horas', () => {
      const r = calculateBarbecue(makeInput({ durationHours: 5 }));
      expectNoScientificNotation(r);
    });

    it('8 horas - aplica aumento de consumo (+20%)', () => {
      const r2 = calculateBarbecue(makeInput({ durationHours: 2 }));
      const r8 = calculateBarbecue(makeInput({ durationHours: 8 }));
      expectNoScientificNotation(r8);
      expect(r8.totalMeatKg).toBeGreaterThan(r2.totalMeatKg);
    });
  });

  describe('Tipo de consumo', () => {
    it('leve', () => {
      const r = calculateBarbecue(makeInput({ audienceType: 'leve' }));
      expectNoScientificNotation(r);
      const rMod = calculateBarbecue(makeInput({ audienceType: 'moderado' }));
      expect(r.totalMeatKg).toBeLessThan(rMod.totalMeatKg);
    });

    it('moderado', () => {
      const r = calculateBarbecue(makeInput({ audienceType: 'moderado' }));
      expectNoScientificNotation(r);
    });

    it('pesado - aumenta bebidas (+30%)', () => {
      const rLeve = calculateBarbecue(makeInput({ audienceType: 'leve', includeAlcohol: true }));
      const rPesado = calculateBarbecue(makeInput({ audienceType: 'pesado', includeAlcohol: true }));
      expectNoScientificNotation(rPesado);
      expect(rPesado.beerLiters).toBeGreaterThan(rLeve.beerLiters);
    });
  });

  describe('Casos extremos (edge cases)', () => {
    it('0 pessoas - usa mínimo 0.5 efetivo', () => {
      const r = calculateBarbecue(makeInput({ menCount: 0, womenCount: 0, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expect(r.effectivePeople).toBeGreaterThanOrEqual(0.5);
    });

    it('inputs como string são convertidos', () => {
      const r = calculateBarbecue({
        ...baseInput,
        menCount: '5' as unknown as number,
        womenCount: '5' as unknown as number,
        childrenCount: '0' as unknown as number,
        durationHours: '4' as unknown as number,
      });
      expectNoScientificNotation(r);
      expect(r.totalMeatKg).toBeGreaterThan(0);
    });

    it('valores decimais são arredondados', () => {
      const r = calculateBarbecue(makeInput({ menCount: 2.7, womenCount: 3.2, childrenCount: 1.1 }));
      expectNoScientificNotation(r);
    });

    it('número grande (1000 pessoas) - limitado', () => {
      const r = calculateBarbecue(makeInput({ menCount: 500, womenCount: 500, childrenCount: 0 }));
      expectNoScientificNotation(r);
      expect(r.totalMeatKg).toBeLessThanOrEqual(99999);
    });

    it('strings inválidas ("abc") viram 0', () => {
      const r = calculateBarbecue({
        ...baseInput,
        menCount: 'abc' as unknown as number,
        womenCount: 'abc' as unknown as number,
        childrenCount: 'abc' as unknown as number,
        durationHours: 4,
      });
      expectNoScientificNotation(r);
      expect(r.effectivePeople).toBeGreaterThanOrEqual(0.5);
    });

    it('input vazio ("") viram 0', () => {
      const r = calculateBarbecue({
        ...baseInput,
        menCount: '' as unknown as number,
        womenCount: '' as unknown as number,
        childrenCount: '' as unknown as number,
        durationHours: 4,
      });
      expectNoScientificNotation(r);
    });

    it('null/undefined viram 0', () => {
      const r = calculateBarbecue({
        ...baseInput,
        menCount: null as unknown as number,
        womenCount: undefined as unknown as number,
        childrenCount: 0,
        durationHours: 4,
      });
      expectNoScientificNotation(r);
    });
  });

  describe('Robustez - nunca valores absurdos', () => {
    it('resultado nunca tem notação científica', () => {
      const inputs: BarbecueInput[] = [
        makeInput({ menCount: 1, womenCount: 0, childrenCount: 0 }),
        makeInput({ menCount: 100, womenCount: 100, childrenCount: 0 }),
        makeInput({ menCount: 0, womenCount: 0, childrenCount: 10 }),
      ];
      for (const input of inputs) {
        const r = calculateBarbecue(input);
        expectNoScientificNotation(r);
      }
    });

    it('shoppingList nunca contém notação científica', () => {
      const r = calculateBarbecue(makeInput({ menCount: 10 }));
      for (const item of r.shoppingList) {
        expect(item).not.toMatch(/e\+|e-\d/i);
      }
    });

    it('mesmo input produz mesmo output (função pura)', () => {
      const input = makeInput({ menCount: 5, womenCount: 5 });
      const r1 = calculateBarbecue(input);
      const r2 = calculateBarbecue(input);
      expect(r1.totalMeatKg).toBe(r2.totalMeatKg);
      expect(r1.beerLiters).toBe(r2.beerLiters);
    });
  });
});

describe('validateBarbecueInput', () => {
  it('aceita input válido', () => {
    expect(validateBarbecueInput(baseInput).valid).toBe(true);
  });

  it('rejeita 0 pessoas', () => {
    const r = validateBarbecueInput(makeInput({ menCount: 0, womenCount: 0, childrenCount: 0 }));
    expect(r.valid).toBe(false);
    expect('error' in r && r.error).toContain('pessoa');
  });

  it('rejeita número negativo de pessoas', () => {
    const r = validateBarbecueInput(makeInput({ menCount: -1, womenCount: 5 }));
    expect(r.valid).toBe(false);
  });

  it('rejeita duração 0', () => {
    const r = validateBarbecueInput(makeInput({ durationHours: 0 }));
    expect(r.valid).toBe(false);
    expect('error' in r && r.error).toContain('duração');
  });

  it('rejeita duração > 24', () => {
    const r = validateBarbecueInput(makeInput({ durationHours: 25 }));
    expect(r.valid).toBe(false);
  });

  it('rejeita categoria > 5000', () => {
    const r = validateBarbecueInput(makeInput({ menCount: 5001 }));
    expect(r.valid).toBe(false);
    expect('error' in r && r.error).toContain('5.000');
  });
});

describe('formatarNumero e formatarNumeroExibicao', () => {
  it('formatarNumero retorna 0 para não finito', () => {
    expect(formatarNumero(NaN)).toBe(0);
    expect(formatarNumero(Infinity)).toBe(0);
    expect(formatarNumero(-Infinity)).toBe(0);
  });

  it('formatarNumero formata com 2 decimais', () => {
    expect(formatarNumero(1.234)).toBe(1.23);
    expect(formatarNumero(5.999)).toBe(6);
  });

  it('formatarNumeroExibicao nunca retorna notação científica', () => {
    expect(formatarNumeroExibicao(1.5)).not.toMatch(/e\+|e-/);
    expect(formatarNumeroExibicao(999)).not.toMatch(/e\+|e-/);
    expect(formatarNumeroExibicao(99999)).not.toMatch(/e\+|e-/);
  });

  it('formatarNumeroExibicao retorna — para valores inválidos', () => {
    expect(formatarNumeroExibicao(NaN)).toBe('—');
    expect(formatarNumeroExibicao(100000)).toBe('—');
    expect(formatarNumeroExibicao(-1)).toBe('—');
  });
});

describe('validarNumero', () => {
  it('aceita números válidos >= 0', () => {
    expect(validarNumero(0)).toBe(true);
    expect(validarNumero(5)).toBe(true);
    expect(validarNumero(100)).toBe(true);
  });

  it('rejeita negativos, NaN, undefined', () => {
    expect(validarNumero(-1)).toBe(false);
    expect(validarNumero(NaN)).toBe(false);
    expect(validarNumero(undefined)).toBe(false);
    expect(validarNumero(null)).toBe(false);
  });

  it('rejeita strings', () => {
    expect(validarNumero('5')).toBe(false);
    expect(validarNumero('abc')).toBe(false);
  });
});

describe('formatarPeso', () => {
  it('valores < 1000 em kg', () => {
    expect(formatarPeso(999)).toBe('999 kg');
    expect(formatarPeso(5.5)).toBe('5.5 kg');
    expect(formatarPeso(0)).toBe('0 kg');
  });
  it('valores >= 1000 em toneladas', () => {
    expect(formatarPeso(1000)).toBe('1 t');
    expect(formatarPeso(1500)).toBe('1.5 t');
    expect(formatarPeso(2500)).toBe('2.5 t');
  });
  it('retorna "0 kg" para valores inválidos', () => {
    expect(formatarPeso(NaN)).toBe('0 kg');
    expect(formatarPeso(Infinity)).toBe('0 kg');
  });
});

describe('encodeShareData / decodeShareData', () => {
  it('codifica e decodifica corretamente', () => {
    const result = calculateBarbecue(baseInput);
    const data = { result, peopleCount: 10, durationHours: 4 };
    const encoded = encodeShareData(data);
    const decoded = decodeShareData(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.peopleCount).toBe(10);
    expect(decoded?.durationHours).toBe(4);
    expect(decoded?.result.totalMeatKg).toBe(result.totalMeatKg);
  });

  it('retorna null para string inválida', () => {
    expect(decodeShareData('invalid-base64!!!')).toBeNull();
  });
});
