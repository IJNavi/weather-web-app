import { useState } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherCard from './components/WeatherCard';
import WeatherAnimation from './components/WeatherAnimation';
import AdvancedWeather from './components/AdvancedWeather';
import useWeather from './hooks/useWeather';

function App() {
  const { weather, loading, error, fetchWeather } = useWeather();
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 shadow-soft backdrop-blur-lg md:p-10">
        <header className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-4xl shadow-lg shadow-cyan-500/10">
            ☀️
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Clima Fácil</h1>
            <p className="mx-auto max-w-2xl text-slate-400">Digite a cidade. Para maior precisão, use também estado e país, especialmente para cidades com nomes iguais.</p>
          </div>
        </header>

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Modo de pesquisa</p>
            <p className="text-lg font-semibold text-slate-100">Escolha entre busca simples ou verificação avançada</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('simple')}
              className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${activeTab === 'simple' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Busca simples
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${activeTab === 'advanced' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Verificação avançada
            </button>
          </div>
        </div>

        {activeTab === 'simple' ? (
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
        ) : (
          <main className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
            <AdvancedWeather />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
