import { useState, FormEvent } from 'react';

interface WeatherQuery {
  city: string;
  state?: string;
  country?: string;
}

interface WeatherFormProps {
  onSearch: (query: WeatherQuery) => void;
  loading: boolean;
}

export default function WeatherForm({ onSearch, loading }: WeatherFormProps) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    onSearch({
      city: trimmedCity,
      state: state.trim() || undefined,
      country: country.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Cidade</label>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Digite a cidade"
            className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-400/90 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300">Estado (opcional)</label>
            <input
              value={state}
              onChange={(event) => setState(event.target.value)}
              placeholder="Ex: SP, NY, RS"
              className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-400/90 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">País (opcional)</label>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="Ex: Brasil, EUA"
              className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-400/90 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar clima'}
        </button>
      </div>
      <p className="text-sm text-slate-500">
        Informe a cidade. Para maior precisão, adicione estado (ex: SP, NY) e país (ex: Brasil, EUA).
        Use nomes em português ou inglês.
      </p>
    </form>
  );
}
