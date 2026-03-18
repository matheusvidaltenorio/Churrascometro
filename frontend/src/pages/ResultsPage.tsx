import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import type { BarbecueResult } from '../types/barbecue';
import { formatarNumeroExibicao, formatarPeso } from '../utils/formatarNumero';

export function ResultsPage() {
  const { state } = useLocation();
  const [copied, setCopied] = useState(false);

  const result = state?.result as BarbecueResult | undefined;
  const shareUrl = state?.shareUrl as string | undefined;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-gray-400 mb-4">Nenhum resultado encontrado.</p>
        <Link to="/calcular" className="text-churrasco-warm hover:underline">
          Fazer novo cálculo
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Fallback: copiar resumo como texto
      const text = `Churrascômetro - Lista de compras:\n${result.shoppingList.join('\n')}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    // Remove emojis para o PDF (jsPDF não suporta Unicode/emoji)
    const clean = (s: string) => s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    doc.setFontSize(22);
    doc.text('Churrascômetro - Lista de Compras', 20, 20);
    doc.setFontSize(12);
    doc.text('Quantidades calculadas para seu churrasco:', 20, 30);

    let y = 45;
    result.shoppingList.forEach((item) => {
      doc.text(`• ${clean(item)}`, 20, y);
      y += 8;
    });

    if (result.meatBreakdown) {
      y += 10;
      doc.setFontSize(14);
      doc.text('Detalhamento de carnes:', 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(`Carne bovina: ${formatarPeso(result.meatBreakdown.bovina)}`, 20, y);
      y += 6;
      doc.text(`Frango: ${formatarPeso(result.meatBreakdown.frango)}`, 20, y);
      y += 6;
      doc.text(`Linguica: ${formatarPeso(result.meatBreakdown.linguica)}`, 20, y);
    }

    doc.save('churrascometro-lista-compras.pdf');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/calcular"
          className="text-churrasco-warm hover:text-churrasco-orange text-sm mb-6 inline-block"
        >
          ← Novo cálculo
        </Link>

        <h1 className="font-display text-4xl text-churrasco-red mb-2">Seu churrasco</h1>
        <p className="text-gray-400 mb-8">Quantidades ideais para não faltar e não desperdiçar</p>

        {/* Painel: Base do cálculo por pessoa */}
        {result.perPerson && result.effectivePeople && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-churrasco-orange/30">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-churrasco-orange">📊</span> Base do cálculo
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Em média, cada pessoa consome cerca de <strong className="text-gray-300">400g a 700g</strong> de carne e bebe <strong className="text-gray-300">1,5L a 2L</strong> de cerveja (adultos). No seu churrasco:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-gray-800/50">
                <p className="text-gray-500 text-xs mb-1">Carne/pessoa</p>
                <p className="font-medium text-churrasco-warm">{formatarNumeroExibicao(result.perPerson.meatG)}g</p>
              </div>
              {result.perPerson.beerL > 0 && (
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <p className="text-gray-500 text-xs mb-1">Cerveja/adulto</p>
                  <p className="font-medium text-churrasco-warm">{formatarNumeroExibicao(result.perPerson.beerL)} L</p>
                </div>
              )}
              <div className="p-3 rounded-lg bg-gray-800/50">
                <p className="text-gray-500 text-xs mb-1">Refrigerante/pessoa</p>
                <p className="font-medium text-churrasco-warm">{formatarNumeroExibicao(result.perPerson.sodaL)} L</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/50">
                <p className="text-gray-500 text-xs mb-1">Carvão/pessoa</p>
                <p className="font-medium text-churrasco-warm">{formatarNumeroExibicao(result.perPerson.charcoalG)}g</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/50">
                <p className="text-gray-500 text-xs mb-1">Gelo/pessoa</p>
                <p className="font-medium text-churrasco-warm">{formatarNumeroExibicao(result.perPerson.iceG)}g</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Considerando {formatarNumeroExibicao(result.effectivePeople)} {result.effectivePeople === 1 ? 'pessoa efetiva' : 'pessoas efetivas'} (crianças contam como 0,5)
            </p>
          </div>
        )}

        {/* Cards de resultado */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <ResultCard
            icon="🥩"
            label="Carne total"
            value={formatarPeso(result.totalMeatKg)}
          />
          {result.beerLiters > 0 && (
            <ResultCard
              icon="🍺"
              label="Cerveja"
              value={`${formatarNumeroExibicao(result.beerLiters)} L`}
            />
          )}
          <ResultCard
            icon="🥤"
            label="Refrigerante/água"
            value={`${formatarNumeroExibicao(result.sodaLiters)} L`}
          />
          <ResultCard
            icon="🔥"
            label="Carvão"
            value={formatarPeso(result.charcoalKg)}
          />
          <ResultCard
            icon="🧊"
            label="Gelo"
            value={formatarPeso(result.iceKg)}
          />
        </div>

        {/* Tipos de carne */}
        {result.meatBreakdown && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <h2 className="font-semibold text-lg mb-4">Tipos de carne sugeridos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>🥩 Carne bovina (picanha, costela...)</span>
                <span className="font-medium text-churrasco-warm">{formatarPeso(result.meatBreakdown.bovina)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🍗 Frango</span>
                <span className="font-medium text-churrasco-warm">{formatarPeso(result.meatBreakdown.frango)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🌭 Linguiça</span>
                <span className="font-medium text-churrasco-warm">{formatarPeso(result.meatBreakdown.linguica)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Lista de compras */}
        <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-gray-700">
          <h2 className="font-semibold text-lg mb-4">📝 Lista de compras</h2>
          <ul className="space-y-2">
            {result.shoppingList.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-churrasco-warm">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-churrasco-red hover:bg-churrasco-red/90 text-white font-medium rounded-lg transition-all"
          >
            {copied ? '✓ Copiado!' : shareUrl ? 'Copiar link para compartilhar' : 'Copiar lista'}
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 bg-churrasco-orange hover:bg-churrasco-orange/90 text-white font-medium rounded-lg transition-all"
          >
            Exportar PDF
          </button>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-600 hover:border-churrasco-warm text-gray-300 hover:text-churrasco-warm rounded-lg transition-all"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
      <span className="text-2xl mb-2 block">{icon}</span>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-bold text-churrasco-warm">{value}</p>
    </div>
  );
}
