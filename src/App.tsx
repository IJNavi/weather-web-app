import WeatherForm from './components/WeatherForm';
import WeatherCard from './components/WeatherCard';
import WeatherAnimation from './components/WeatherAnimation';
import useWeather from './hooks/useWeather';

function App() {
  const { weather, loading, error, fetchWeather } = useWeather();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 shadow-soft backdrop-blur-lg md:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-4xl shadow-lg shadow-cyan-500/10">
            ☀️
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Clima Fácil</h1>
            <p className="mx-auto max-w-2xl text-slate-400">Digite a cidade. Para maior precisão, use também estado e país, especialmente para cidades com nomes iguais.</p>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <section className="space-y-6 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
            <WeatherForm onSearch={fetchWeather} loading={loading} />
            {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-rose-200">{error}</p> : null}
            <div className="space-y-3 rounded-3xl bg-slate-900/80 p-5 text-slate-300">
              <h2 className="text-xl font-semibold text-slate-100">Dicas rápidas</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                <li>Use nomes de cidades conhecidas e, se houver ambiguidade, acrescente estado e país.</li>
                <li>Exemplo: Nova York, NY, EUA ou Porto Alegre, RS, Brasil.</li>
                <li>Nomes podem ser em português ou inglês (ex: EUA ou USA).</li>
                <li>O app utiliza a API Open-Meteo para retornar temperatura e condições.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
            <WeatherAnimation weather={weather?.description ?? 'Céu limpo'} />
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <WeatherCard weather={weather} loading={loading} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
