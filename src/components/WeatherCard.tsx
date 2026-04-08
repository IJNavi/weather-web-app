import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
}

export default function WeatherCard({ weather, loading }: WeatherCardProps) {
  if (loading) {
    return <p className="text-center text-slate-300">Carregando dados do clima…</p>;
  }

  if (!weather) {
    return <p className="text-center text-slate-400">Digite uma cidade e clique em buscar para ver o clima.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-800/90 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/90">{weather.location}</p>
            <h2 className="mt-2 text-4xl font-semibold text-slate-100">{weather.temperature.toFixed(1)}°C</h2>
            <p className="mt-1 text-sm text-slate-400">{weather.description}</p>
          </div>
          <div className="rounded-3xl bg-cyan-500/10 px-4 py-3 text-cyan-200 shadow-lg shadow-cyan-500/10">
            <span className="text-xl font-semibold">{weather.conditionIcon}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sensação</p>
          <p className="mt-3 text-2xl font-semibold text-slate-100">{weather.feelsLike.toFixed(1)}°C</p>
        </div>
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Vento</p>
          <p className="mt-3 text-2xl font-semibold text-slate-100">{weather.windSpeed.toFixed(1)} km/h</p>
        </div>
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Umidade</p>
          <p className="mt-3 text-2xl font-semibold text-slate-100">{weather.humidity}%</p>
        </div>
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Solicitado</p>
          <p className="mt-3 text-2xl font-semibold text-slate-100">{weather.localTime}</p>
        </div>
      </div>
    </div>
  );
}
