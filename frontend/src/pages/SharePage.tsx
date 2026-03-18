import { useParams, Link } from 'react-router-dom';
import { decodeShareData } from '../utils/calculator';
import { formatarNumeroExibicao } from '../utils/formatarNumero';

export function SharePage() {
  const { data } = useParams<{ data: string }>();
  const decoded = data ? decodeShareData(data) : null;
  const result = decoded?.result ?? null;
  const error = !data ? 'Link inválido' : !decoded ? 'Link expirado ou inválido' : '';

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
          {decoded?.name && (
            <p className="font-semibold text-churrasco-warm">{decoded.name}</p>
          )}
        </div>

        <h1 className="font-display text-4xl text-churrasco-red mb-2">Lista de compras</h1>
        <p className="text-gray-400 mb-8">
          {formatarNumeroExibicao(Number(decoded?.peopleCount))} pessoas • {formatarNumeroExibicao(Number(decoded?.durationHours))}h de churrasco
        </p>

        {result.perPerson && result.effectivePeople && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-churrasco-orange/30">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-churrasco-orange">📊</span> Base do cálculo
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Em média, cada pessoa consome cerca de 400g a 700g de carne e bebe 1,5L a 2L de cerveja (adultos). Neste churrasco:
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
              {formatarNumeroExibicao(result.effectivePeople)} {result.effectivePeople === 1 ? 'pessoa efetiva' : 'pessoas efetivas'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <ResultCard icon="🥩" label="Carne" value={`${formatarNumeroExibicao(result.totalMeatKg)} kg`} />
          {result.beerLiters > 0 && (
            <ResultCard icon="🍺" label="Cerveja" value={`${formatarNumeroExibicao(result.beerLiters)} L`} />
          )}
          <ResultCard icon="🥤" label="Refrigerante" value={`${formatarNumeroExibicao(result.sodaLiters)} L`} />
          <ResultCard icon="🔥" label="Carvão" value={`${formatarNumeroExibicao(result.charcoalKg)} kg`} />
          <ResultCard icon="🧊" label="Gelo" value={`${formatarNumeroExibicao(result.iceKg)} kg`} />
        </div>

        {result.meatBreakdown && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <h2 className="font-semibold mb-4">Tipos de carne</h2>
            <div className="space-y-2">
              <p>🥩 Bovina: {formatarNumeroExibicao(result.meatBreakdown.bovina)} kg</p>
              <p>🍗 Frango: {formatarNumeroExibicao(result.meatBreakdown.frango)} kg</p>
              <p>🌭 Linguiça: {formatarNumeroExibicao(result.meatBreakdown.linguica)} kg</p>
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
