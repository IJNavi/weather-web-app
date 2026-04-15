import { useRef, useState } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherByCity, WeatherQuery } from '../services/openMeteo';

const MIN_SEARCH_INTERVAL_MS = 1500;
const ERROR_WAIT_MESSAGE = 'Aguarde alguns segundos antes de tentar outra busca.';

/**
 * Hook para buscar e armazenar o estado do clima atual.
 *
 * O hook impede que múltiplas buscas sejam enviadas em paralelo e também
 * bloqueia pesquisas repetidas em um curto intervalo, reduzindo requisições
 * desnecessárias à API de clima.
 *
 * Retorna o clima carregado, o estado de carregamento, mensagens de erro e
 * uma função para iniciar a busca com base na consulta informada.
 */
export default function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);
  const lastSearchAt = useRef<number | null>(null);

  /**
   * Busca o clima para a consulta fornecida e atualiza o estado do hook.
   *
   * Esta função também protege contra envios duplicados, ignorando novas
   * chamadas enquanto outra busca estiver em andamento ou se a última busca
   * tiver sido executada há menos de 1,5 segundos.
   *
   * @param query - Parâmetros de localização com cidade obrigatória e filtros opcionais.
   */
  async function fetchWeather(query: WeatherQuery) {
    if (requestInProgress.current) return;

    const now = Date.now();
    if (lastSearchAt.current && now - lastSearchAt.current < MIN_SEARCH_INTERVAL_MS) {
      setError(ERROR_WAIT_MESSAGE);
      return;
    }

    requestInProgress.current = true;
    lastSearchAt.current = now;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(query);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err instanceof Error ? err.message : 'Erro inesperado ao buscar o clima.');
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  }

  return { weather, loading, error, fetchWeather };
}
