import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedBarbecue } from '../services/api';
import type { BarbecueResult } from '../types/barbecue';

export function SharePage() {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<(BarbecueResult & { name?: string; peopleCount?: number; durationHours?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Link inválido');
      setLoading(false);
      return;
    }

    getSharedBarbecue(token)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-red-400 mb-4">{error || 'Churrasco não encontrado'}</p>
        <Link to="/" className="text-churrasco-warm hover:underline">
          Ir para o Churrascômetro
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-4 rounded-lg bg-churrasco-red/20 border border-churrasco-red/50">
          <p className="text-sm text-gray-400">Churrasco compartilhado</p>
          {result.name && (
            <p className="font-semibold text-churrasco-warm">{result.name}</p>
          )}
        </div>

        <h1 className="font-display text-4xl text-churrasco-red mb-2">Lista de compras</h1>
        <p className="text-gray-400 mb-8">
          {result.peopleCount ?? '-'} pessoas • {result.durationHours ?? '-'}h de churrasco
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <ResultCard icon="🥩" label="Carne" value={`${result.totalMeatKg} kg`} />
          {result.beerLiters > 0 && (
            <ResultCard icon="🍺" label="Cerveja" value={`${result.beerLiters} L`} />
          )}
          <ResultCard icon="🥤" label="Refrigerante" value={`${result.sodaLiters} L`} />
          <ResultCard icon="🔥" label="Carvão" value={`${result.charcoalKg} kg`} />
          <ResultCard icon="🧊" label="Gelo" value={`${result.iceKg} kg`} />
        </div>

        {result.meatBreakdown && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <h2 className="font-semibold mb-4">Tipos de carne</h2>
            <div className="space-y-2">
              <p>🥩 Bovina: {result.meatBreakdown.bovina} kg</p>
              <p>🍗 Frango: {result.meatBreakdown.frango} kg</p>
              <p>🌭 Linguiça: {result.meatBreakdown.linguica} kg</p>
            </div>
          </div>
        )}

        <ul className="space-y-2 mb-8">
          {result.shoppingList.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-churrasco-warm">•</span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-churrasco-red hover:bg-churrasco-red/90 text-white font-medium rounded-lg"
        >
          Calcular meu churrasco
        </Link>
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
