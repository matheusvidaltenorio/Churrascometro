/**
 * Formata números para exibição amigável.
 * Evita notação científica e valores inválidos.
 */

export function formatarNumero(valor: number): number {
  if (!isFinite(valor)) return 0;
  const n = Number(valor.toFixed(2));
  return isFinite(n) ? n : 0;
}

/**
 * Retorna string formatada para exibição (evita notação científica).
 * Para valores fora do range razoável (ex: bug de cálculo), retorna "—".
 * Usa formatação explícita para nunca exibir 1e+21 etc.
 */
export function formatarNumeroExibicao(valor: number, maxValor = 99999): string {
  if (valor == null || !isFinite(valor) || isNaN(valor)) return '—';
  if (valor < 0 || valor > maxValor) return '—';
  const n = Math.round(valor * 100) / 100;
  if (!isFinite(n)) return '—';
  const s = n.toFixed(2);
  return s.replace(/\.?0+$/, '') || '0';
}
