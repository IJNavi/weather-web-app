import { useState } from 'react';

interface AdvancedWeatherProps {
  onSimpleSearch: (query: { city: string; state?: string; country?: string }) => void;
}

/**
 * Componente de estrutura da aba avançada.
 *
 * Ainda não implementa a pesquisa em lote completa, mas mantém o layout e
 * o ponto de entrada para os futuros controles de busca múltipla.
 */
export default function AdvancedWeather({ onSimpleSearch }: AdvancedWeatherProps) {
  const [city, setCity] = useState('');

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-100">Verificação avançada</h2>
        <p className="mt-3 text-slate-400">
          Use essa aba para pesquisar várias cidades, ver e gerenciar até 10 entradas
          diferentes ao mesmo tempo.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Busca rápida avançada</h3>
            <p className="mt-2 text-slate-400">
              Faça pesquisas em sequência de uma cidade por vez ou use a busca múltipla para
              inserir várias cidades juntas.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Cidade</label>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ex: Lisboa, Lisboa, Portugal"
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-400/90 focus:ring-2 focus:ring-cyan-400/20"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = city.trim();
                if (trimmed) {
                  onSimpleSearch({ city: trimmed });
                }
              }}
              className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Buscar cidade única
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-100">Busca múltipla</h3>
          <p className="mt-2 text-slate-400">
            Até 10 cidades por vez. Separe cidades diferentes com ponto e vírgula.
            Cada cidade aceita cidade, estado e país separados por vírgula.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-3xl bg-slate-800/90 px-6 py-4 text-sm font-semibold text-cyan-300 transition hover:bg-slate-700"
          >
            Busca Múltipla
          </button>
        </aside>
      </div>
    </div>
  );
}
