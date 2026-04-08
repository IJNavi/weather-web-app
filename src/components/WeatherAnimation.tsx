import { getWeatherTheme } from '../utils/weatherMapping';

interface WeatherAnimationProps {
  weather: string;
}

export default function WeatherAnimation({ weather }: WeatherAnimationProps) {
  const theme = getWeatherTheme(weather);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/70 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 text-slate-100 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/90">Condição atual</p>
          <h2 className="mt-3 text-3xl font-semibold">{theme.label}</h2>
          <p className="mt-2 max-w-xl leading-6 text-slate-400">Visualize o clima com animações sutis enquanto vê os dados atualizados.</p>
        </div>
        <div className="weather-icon text-6xl">{theme.icon}</div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {theme.features.map((feature) => (
          <div key={feature} className="rounded-3xl bg-slate-950/70 p-4 text-sm text-slate-300">
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
}
