import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import type { BarbecueResult } from '../types/barbecue';

export function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const result = state?.result as BarbecueResult | undefined;
  const shareUrl = state?.shareUrl as string | undefined;
  const saveFailed = state?.saveFailed as boolean | undefined;

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
    doc.setFontSize(22);
    doc.text('Churrascômetro - Lista de Compras', 20, 20);
    doc.setFontSize(12);
    doc.text('Quantidades calculadas para seu churrasco:', 20, 30);

    let y = 45;
    result.shoppingList.forEach((item) => {
      doc.text(`• ${item}`, 20, y);
      y += 8;
    });

    if (result.meatBreakdown) {
      y += 10;
      doc.setFontSize(14);
      doc.text('Detalhamento de carnes:', 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(`Carne bovina: ${result.meatBreakdown.bovina} kg`, 20, y);
      y += 6;
      doc.text(`Frango: ${result.meatBreakdown.frango} kg`, 20, y);
      y += 6;
      doc.text(`Linguiça: ${result.meatBreakdown.linguica} kg`, 20, y);
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

        {saveFailed && (
          <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-200 text-sm">
            Não foi possível salvar no servidor. Você pode exportar em PDF ou copiar a lista.
          </div>
        )}

        <h1 className="font-display text-4xl text-churrasco-red mb-2">Seu churrasco</h1>
        <p className="text-gray-400 mb-8">Quantidades ideais para não faltar e não desperdiçar</p>

        {/* Cards de resultado */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <ResultCard
            icon="🥩"
            label="Carne total"
            value={`${result.totalMeatKg} kg`}
          />
          {result.beerLiters > 0 && (
            <ResultCard
              icon="🍺"
              label="Cerveja"
              value={`${result.beerLiters} L`}
            />
          )}
          <ResultCard
            icon="🥤"
            label="Refrigerante/água"
            value={`${result.sodaLiters} L`}
          />
          <ResultCard
            icon="🔥"
            label="Carvão"
            value={`${result.charcoalKg} kg`}
          />
          <ResultCard
            icon="🧊"
            label="Gelo"
            value={`${result.iceKg} kg`}
          />
        </div>

        {/* Tipos de carne */}
        {result.meatBreakdown && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <h2 className="font-semibold text-lg mb-4">Tipos de carne sugeridos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>🥩 Carne bovina (picanha, costela...)</span>
                <span className="font-medium text-churrasco-warm">{result.meatBreakdown.bovina} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🍗 Frango</span>
                <span className="font-medium text-churrasco-warm">{result.meatBreakdown.frango} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🌭 Linguiça</span>
                <span className="font-medium text-churrasco-warm">{result.meatBreakdown.linguica} kg</span>
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
            {copied ? '✓ Copiado!' : shareUrl ? 'Compartilhar churrasco' : 'Copiar lista'}
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
