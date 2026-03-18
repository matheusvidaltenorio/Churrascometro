import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AudienceType } from '../types/barbecue';
import { calculateBarbecue, encodeShareData, validateBarbecueInput } from '../utils/calculator';
import { limitarValor } from '../utils/formatarNumero';

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
    durationHours: 0,
    audienceType: 'moderado' as AudienceType,
    menCount: 0,
    womenCount: 0,
    childrenCount: 0,
    includeAlcohol: true,
    name: '',
  });

  const [limitExceededFields, setLimitExceededFields] = useState<Partial<Record<'menCount' | 'womenCount' | 'childrenCount', boolean>>>({});

  const totalPessoas = useMemo(
    () => form.menCount + form.womenCount + form.childrenCount,
    [form.menCount, form.womenCount, form.childrenCount]
  );

  const updateForm = (key: string, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const updatePeopleField = (key: 'menCount' | 'womenCount' | 'childrenCount', value: unknown) => {
    const raw = Number(value) || 0;
    const capped = limitarValor(raw);
    setForm((prev) => ({ ...prev, [key]: capped }));
    setLimitExceededFields((prev) => ({ ...prev, [key]: raw > 5000 }));
    setError('');
  };

  const handleSubmit = (share = false) => {
    const input = {
      peopleCount: totalPessoas,
      durationHours: Number(form.durationHours) ?? 0,
      audienceType: form.audienceType,
      menCount: limitarValor(form.menCount),
      womenCount: limitarValor(form.womenCount),
      childrenCount: limitarValor(form.childrenCount),
      includeAlcohol: Boolean(form.includeAlcohol),
    };

    const validation = validateBarbecueInput(input);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');

    const men = limitarValor(input.menCount);
    const women = limitarValor(input.womenCount);
    const children = limitarValor(input.childrenCount);
    const sanitizedInput = {
      ...input,
      menCount: men,
      womenCount: women,
      childrenCount: children,
      durationHours: Math.max(1, Math.min(24, Number(input.durationHours) || 1)),
      peopleCount: men + women + children,
    };
    const result = calculateBarbecue(sanitizedInput);
    const shareUrl = share
      ? `${window.location.origin}/share/${encodeShareData({
          result,
          name: form.name || undefined,
          peopleCount: sanitizedInput.peopleCount,
          durationHours: sanitizedInput.durationHours,
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
          {/* Categorias de pessoas - total calculado automaticamente */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Homens</label>
              <input
                type="number"
                min="0"
                max="5000"
                step="1"
                value={form.menCount}
                onChange={(e) => updatePeopleField('menCount', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
              />
              {limitExceededFields.menCount && (
                <p className="mt-1 text-sm text-amber-400">O limite máximo por categoria é 5.000 pessoas</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mulheres</label>
              <input
                type="number"
                min="0"
                max="5000"
                step="1"
                value={form.womenCount}
                onChange={(e) => updatePeopleField('womenCount', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
              />
              {limitExceededFields.womenCount && (
                <p className="mt-1 text-sm text-amber-400">O limite máximo por categoria é 5.000 pessoas</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Crianças</label>
              <input
                type="number"
                min="0"
                max="5000"
                step="1"
                value={form.childrenCount}
                onChange={(e) => updatePeopleField('childrenCount', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-churrasco-red"
              />
              {limitExceededFields.childrenCount && (
                <p className="mt-1 text-sm text-amber-400">O limite máximo por categoria é 5.000 pessoas</p>
              )}
            </div>
          </div>

          {/* Total de pessoas - somente leitura */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total de pessoas
            </label>
            <input
              type="text"
              value={totalPessoas}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Calculado automaticamente a partir das categorias acima</p>
          </div>
          <p className="text-xs text-gray-500">Crianças contam como 0,5 pessoa no cálculo</p>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duração do churrasco (horas)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={form.durationHours}
              onChange={(e) => {
                const v = Math.max(0, Math.min(24, Number(e.target.value) || 0));
                updateForm('durationHours', v);
              }}
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
