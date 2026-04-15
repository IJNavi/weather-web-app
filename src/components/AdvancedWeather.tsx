import { useMemo, useState } from 'react';
import { WeatherData, WeatherForecastEntry } from '../types/weather';
import { fetchWeatherByCity, fetchWeatherForecastByLocation, WeatherQuery } from '../services/openMeteo';
import { buildLocationKey, formatQueryLabel, parseBatchCities } from '../utils/advancedWeather';
import AdvancedWeatherCard from './AdvancedWeatherCard';
import ConfirmDialog from './ConfirmDialog';
import Modal from './Modal';

const MAX_DISPLAYED_CITIES = 10;

interface ConfirmState {
  type: 'replace' | 'clear' | 'remove';
  message: string;
  payload?: WeatherQuery[] | string | null;
}

export default function AdvancedWeather() {
  const [city, setCity] = useState('');
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [entries, setEntries] = useState<WeatherData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecastEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const existingKeys = useMemo(() => new Set(entries.map((entry) => buildLocationKey({
    city: entry.city ?? entry.location,
    state: entry.state,
    country: entry.country
  }))), [entries]);

  const clearFeedback = () => setFeedback(null);

  const prepareSearchQueries = (queries: WeatherQuery[]) => {
    const uniqueQueries: WeatherQuery[] = [];
    const duplicateLabels: string[] = [];
    const seen = new Set(existingKeys);

    for (const query of queries) {
      const key = buildLocationKey(query);
      if (seen.has(key)) {
        duplicateLabels.push(formatQueryLabel(query));
        continue;
      }
      seen.add(key);
      uniqueQueries.push(query);
    }

    return { uniqueQueries, duplicateLabels };
  };

  const fetchAndAddQueries = async (queries: WeatherQuery[]) => {
    setLoading(true);
    clearFeedback();

    const newEntries: WeatherData[] = [];
    const skipped: string[] = [];

    for (const query of queries) {
      try {
        const weather = await fetchWeatherByCity(query);
        newEntries.push(weather);
      } catch (error) {
        skipped.push(query.city);
      }
    }

    if (skipped.length > 0) {
      setFeedback(`Não foi possível buscar as cidades: ${skipped.join(', ')}.`);
    }

    setEntries((current) => [...current, ...newEntries].slice(0, MAX_DISPLAYED_CITIES));
    setLoading(false);
  };

  const handleQueries = async (queries: WeatherQuery[]) => {
    clearFeedback();
    if (queries.length === 0) {
      setFeedback('Informe ao menos uma cidade para buscar.');
      return;
    }

    const { uniqueQueries, duplicateLabels } = prepareSearchQueries(queries);
    if (duplicateLabels.length > 0) {
      setFeedback(`As seguintes cidades já estão exibidas e não serão buscadas novamente: ${duplicateLabels.join(', ')}.`);
    }

    if (uniqueQueries.length === 0) return;

    const availableSlots = MAX_DISPLAYED_CITIES - entries.length;
    const requiresReplacement = duplicateLabels.length === 0 && uniqueQueries.length > availableSlots && entries.length > 0;

    if (requiresReplacement) {
      setConfirmState({
        type: 'replace',
        message: `A busca trará ${uniqueQueries.length} cidades novas e a lista atual tem ${entries.length}. Deseja remover as ${uniqueQueries.length - availableSlots} cidades mais antigas para acomodar todas as novas?`,
        payload: uniqueQueries
      });
      return;
    }

    if (availableSlots <= 0) {
      setFeedback('A lista de exibição já está cheia. Nenhuma nova cidade pode ser adicionada.');
      return;
    }

    const queriesToFetch = uniqueQueries.slice(0, availableSlots);
    if (queriesToFetch.length < uniqueQueries.length) {
      setFeedback(`Apenas as primeiras ${queriesToFetch.length} cidades não repetidas foram adicionadas para não ultrapassar o limite de ${MAX_DISPLAYED_CITIES}.`);
    }

    await fetchAndAddQueries(queriesToFetch);
  };

  const handleSingleSearch = async () => {
    const trimmed = city.trim();
    if (!trimmed) {
      setFeedback('Digite uma cidade para buscar.');
      return;
    }

    const queries = parseBatchCities(trimmed).slice(0, 1);
    await handleQueries(queries);
  };

  const handleBatchSearch = async () => {
    const parsed = parseBatchCities(batchText);
    if (parsed.length === 0) {
      setFeedback('Digite até 10 cidades separadas por ponto e vírgula.');
      return;
    }

    await handleQueries(parsed);
  };

  const handleConfirmReplace = async () => {
    if (!confirmState || confirmState.type !== 'replace') return;
    const queriesToAdd = confirmState.payload as WeatherQuery[];
    if (!queriesToAdd) return;

    const availableSlots = MAX_DISPLAYED_CITIES - entries.length;
    const replacementCount = Math.max(0, queriesToAdd.length - availableSlots);

    setConfirmState(null);
    if (replacementCount > 0) {
      setEntries((current) => current.slice(replacementCount));
    }

    await fetchAndAddQueries(queriesToAdd);
  };

  const handleClearAll = () => {
    if (entries.length === 0) return;
    setConfirmState({
      type: 'clear',
      message: 'Deseja realmente limpar todas as cidades exibidas?',
      payload: null
    });
  };

  const handleRemoveEntry = (key: string) => {
    setConfirmState({
      type: 'remove',
      message: 'Deseja remover esta cidade da lista?',
      payload: key
    });
  };

  const confirmAction = async () => {
    if (!confirmState) return;

    if (confirmState.type === 'clear') {
      setEntries([]);
      setFeedback('Lista de cidades limpa.');
    }

    if (confirmState.type === 'remove' && typeof confirmState.payload === 'string') {
      setEntries((current) => current.filter((entry) => buildLocationKey({
        city: entry.city ?? entry.location,
        state: entry.state,
        country: entry.country
      }) !== confirmState.payload));
      setFeedback('Cidade removida com sucesso.');
    }

    if (confirmState.type === 'replace') {
      await handleConfirmReplace();
      return;
    }

    setConfirmState(null);
  };

  const cancelConfirm = () => {
    setConfirmState(null);
    setFeedback('A ação foi cancelada.');
  };

  const openDetails = async (entry: WeatherData) => {
    setSelectedEntry(entry);
    setForecast(null);
    if (!entry.latitude || !entry.longitude || !entry.timezone) {
      setFeedback('Dados de localização insuficientes para previsão estendida.');
      return;
    }

    setLoading(true);
    try {
      const forecastData = await fetchWeatherForecastByLocation({
        latitude: entry.latitude,
        longitude: entry.longitude,
        timezone: entry.timezone
      });
      setForecast(forecastData);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao carregar a previsão estendida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-100">Verificação avançada</h2>
        <p className="mt-3 text-slate-400">
          Aqui você pode pesquisar várias cidades e comparar até 10 entradas diferentes por vez.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Busca rápida avançada</h3>
            <p className="mt-2 text-slate-400">
              Informe uma cidade, estado e país separados por vírgula para buscar uma entrada individual.
            </p>
          </div>

          <div className="grid gap-4">
            <label htmlFor="advanced-city-input" className="block text-sm font-medium text-slate-300">Cidade única</label>
            <input
              id="advanced-city-input"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ex: Rio de Janeiro, Rio de Janeiro, Brasil"
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-400/90 focus:ring-2 focus:ring-cyan-400/20"
            />
            <button
              type="button"
              onClick={handleSingleSearch}
              className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Buscar cidade única
            </button>
          </div>

          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-100">Busca múltipla</h4>
                <p className="mt-2 text-sm text-slate-400">
                  Adicione até 10 cidades separadas por ponto e vírgula. Cada cidade pode incluir estado e país.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchForm((current) => !current)}
                className="rounded-3xl border border-cyan-500/70 bg-slate-900 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-slate-800"
              >
                {showBatchForm ? 'Ocultar busca múltipla' : 'Busca Múltipla'}
              </button>
            </div>

            {showBatchForm ? (
              <div className="mt-5 space-y-4">
                <textarea
                  value={batchText}
                  onChange={(event) => setBatchText(event.target.value)}
                  rows={6}
                  placeholder="Ex: Rio de Janeiro, Rio de Janeiro, Brasil; Nova York, Nova York, Estados Unidos"
                  className="min-h-[160px] w-full resize-none rounded-3xl border border-slate-700/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-400/90 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  type="button"
                  onClick={handleBatchSearch}
                  className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Enviar busca múltipla
                </button>
              </div>
            ) : null}
          </div>

          {feedback ? <p className="rounded-3xl bg-slate-900/80 px-5 py-4 text-sm text-slate-200">{feedback}</p> : null}
        </section>

        <aside className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Lista de cidades</p>
              <p className="mt-1 text-slate-400">Exibindo {entries.length} de {MAX_DISPLAYED_CITIES} cidades permitidas.</p>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-3xl border border-rose-500/70 bg-slate-900 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-slate-800"
            >
              Limpar tudo
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {entries.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhuma cidade adicionada ainda. Use os formulários para começar.</p>
            ) : (
              entries.map((entry) => {
                const key = buildLocationKey({ city: entry.city ?? entry.location, state: entry.state, country: entry.country });
                return (
                  <AdvancedWeatherCard
                    key={key}
                    weather={entry}
                    onSelect={() => openDetails(entry)}
                    onRemove={() => handleRemoveEntry(key)}
                  />
                );
              })
            )}
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-slate-300">Buscando clima para a cidade selecionada…</p>
          ) : null}
        </aside>
      </div>

      {selectedEntry ? (
        <Modal
          title={`Previsão estendida - ${selectedEntry.location}`}
          description="Detalhes e previsão para os próximos dias."
          onClose={() => {
            setSelectedEntry(null);
            setForecast(null);
          }}
        >
          <div className="space-y-5 text-slate-300">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Temperatura atual</p>
                <p className="mt-3 text-3xl font-semibold text-slate-100">{selectedEntry.temperature.toFixed(1)}°C</p>
                <p className="mt-2 text-sm text-slate-400">{selectedEntry.description}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Hora local</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{selectedEntry.localTime}</p>
                <p className="mt-2 text-sm text-slate-400">Dados com base na localização selecionada.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/80 p-5">
              <h4 className="text-lg font-semibold text-slate-100">Previsão para os próximos dias</h4>
              {loading ? (
                <p className="mt-4 text-slate-300">Carregando previsão estendida…</p>
              ) : forecast && forecast.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {forecast.map((day) => (
                    <div key={day.date} className="rounded-3xl border border-slate-700/80 bg-slate-950/90 p-4">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{day.date}</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-100">{day.maxTemp.toFixed(0)}° / {day.minTemp.toFixed(0)}°</p>
                      <p className="mt-2 text-sm text-slate-300">{day.icon} {day.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-slate-300">Previsão estendida ainda não disponível.</p>
              )}
            </div>
          </div>
        </Modal>
      ) : null}

      {confirmState ? (
        <ConfirmDialog
          title="Confirmação necessária"
          message={confirmState.message}
          onConfirm={confirmAction}
          onCancel={cancelConfirm}
        />
      ) : null}
    </div>
  );
}
