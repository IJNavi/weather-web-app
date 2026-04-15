import { WeatherData } from '../types/weather';

interface AdvancedWeatherCardProps {
  weather: WeatherData;
  onSelect: () => void;
  onRemove: () => void;
}

/**
 * Card que representa uma cidade adicionada na lista avançada.
 *
 * Exibe informações básicas e permite seleção para previsão estendida ou remoção.
 */
export default function AdvancedWeatherCard({ weather, onSelect, onRemove }: AdvancedWeatherCardProps) {
  return (
    <article
      onClick={onSelect}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/90 p-5 transition hover:border-cyan-500/70 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/90">{weather.location}</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-100">{weather.temperature.toFixed(1)}°C</h3>
          <p className="mt-2 text-sm text-slate-400">{weather.description}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          aria-label={`Remover ${weather.location}`}
        >
          X
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Vento</p>
          <p className="mt-2 font-semibold text-slate-100">{weather.windSpeed.toFixed(1)} km/h</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Umidade</p>
          <p className="mt-2 font-semibold text-slate-100">{weather.humidity}%</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Solicitado</p>
          <p className="mt-2 font-semibold text-slate-100">{weather.localTime}</p>
        </div>
      </div>
    </article>
  );
}
