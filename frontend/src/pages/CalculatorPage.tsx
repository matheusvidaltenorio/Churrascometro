import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AudienceType } from '../types/barbecue';
import { calculateBarbecue, encodeShareData } from '../utils/calculator';

const AUDIENCE_OPTIONS: { value: AudienceType; label: string; desc: string }[] = [
  { value: 'leve', label: 'Leve', desc: 'Pouca fome, mais conversa' },
  { value: 'moderado', label: 'Moderado', desc: 'Equilíbrio' },
  { value: 'pesado', label: 'Pesado', desc: 'Comem e bebem bastante' },
];

export function CalculatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    peopleCount: 10,
    durationHours: 4,
    audienceType: 'moderado' as AudienceType,
    menCount: 5,
    womenCount: 4,
    childrenCount: 1,
    includeAlcohol: true,
    name: '',
  });

  const updateForm = (key: string, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const syncPeopleCount = () => {
    updateForm('peopleCount', form.menCount + form.womenCount + form.childrenCount);
  };

  const handleSubmit = (share = false) => {
    const input = {
      peopleCount: form.peopleCount,
      durationHours: form.durationHours,
      audienceType: form.audienceType,
      menCount: form.menCount,
      womenCount: form.womenCount,
      childrenCount: form.childrenCount,
      includeAlcohol: form.includeAlcohol,
    };

    if (input.peopleCount < 1) {
      setError('Informe pelo menos 1 pessoa');
      return;
    }

    setLoading(true);
    setError('');

    const result = calculateBarbecue(input);
    const shareUrl = share
      ? `${window.location.origin}/share/${encodeShareData({
          result,
          name: form.name || undefined,
          peopleCount: input.peopleCount,
          durationHours: input.durationHours,
        })}`
      : undefined;

    setLoading(false);
    navigate('/resultado', { state: { result, shareUrl } });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link to="/" className="text-churrasco-warm hover:text-churrasco-orange text-sm mb-6 inline-block">
          ← Voltar
        </Link>

        <h1 className="font-display text-4xl text-churrasco-red mb-2">Calcular churrasco</h1>
        <p className="text-gray-400 mb-8">Preencha os dados para descobrir quanto comprar</p>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
        >
          {/* Número de pessoas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de pessoas
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={form.peopleCount}
              onChange={(e) => updateForm('peopleCount', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red focus:border-transparent"
            />
          </div>

          {/* Detalhamento */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Homens</label>
              <input
                type="number"
                min="0"
                value={form.menCount}
                onChange={(e) => {
                  updateForm('menCount', parseInt(e.target.value) || 0);
                  setTimeout(syncPeopleCount, 0);
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mulheres</label>
              <input
                type="number"
                min="0"
                value={form.womenCount}
                onChange={(e) => {
                  updateForm('womenCount', parseInt(e.target.value) || 0);
                  setTimeout(syncPeopleCount, 0);
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Crianças</label>
              <input
                type="number"
                min="0"
                value={form.childrenCount}
                onChange={(e) => {
                  updateForm('childrenCount', parseInt(e.target.value) || 0);
                  setTimeout(syncPeopleCount, 0);
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">Crianças contam como 0,5 pessoa no cálculo</p>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duração do churrasco (horas)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={form.durationHours}
              onChange={(e) => updateForm('durationHours', parseFloat(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
            />
            <p className="text-xs text-gray-500 mt-1">Churrascos &gt; 6h têm +20% de consumo</p>
          </div>

          {/* Tipo de público */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de público
            </label>
            <div className="space-y-2">
              {AUDIENCE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    form.audienceType === opt.value
                      ? 'border-churrasco-red bg-churrasco-red/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="audienceType"
                    value={opt.value}
                    checked={form.audienceType === opt.value}
                    onChange={() => updateForm('audienceType', opt.value)}
                    className="accent-churrasco-red"
                  />
                  <div>
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-gray-400 text-sm ml-2">— {opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Nome (opcional, para compartilhar) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do churrasco <span className="text-gray-500">(opcional, ao compartilhar)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Aniversário do João"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red focus:border-transparent"
            />
          </div>

          {/* Bebida alcoólica */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700">
            <div>
              <span className="font-medium">Incluir cerveja?</span>
              <p className="text-sm text-gray-400">Bebida alcoólica no cálculo</p>
            </div>
            <button
              type="button"
              onClick={() => updateForm('includeAlcohol', !form.includeAlcohol)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                form.includeAlcohol ? 'bg-churrasco-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  form.includeAlcohol ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-churrasco-red hover:bg-churrasco-red/90 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Calculando...' : 'Calcular'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 px-6 py-4 bg-churrasco-orange hover:bg-churrasco-orange/90 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
            >
              Calcular e compartilhar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
