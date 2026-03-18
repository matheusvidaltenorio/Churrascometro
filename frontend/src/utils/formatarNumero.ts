/**
 * Formata números para exibição amigável.
 * Evita notação científica e valores inválidos.
 */

export function formatarNumero(valor: number): number {
  if (valor == null || !isFinite(valor) || isNaN(valor)) return 0;
  return Math.round(valor * 100) / 100;
}

/**
 * Retorna string formatada para exibição (evita notação científica).
 * Para valores fora do range razoável (ex: bug de cálculo), retorna "—".
 */
export function formatarNumeroExibicao(valor: number, maxValor = 99999): string {
  if (valor == null || !isFinite(valor) || isNaN(valor)) return '—';
  if (valor < 0 || valor > maxValor) return '—';
  const n = Math.round(valor * 100) / 100;
  return n.toString();
}
