import { useState } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherByCity, WeatherQuery } from '../services/openMeteo';

/**
 * Hook para buscar e armazenar o estado do clima atual.
 *
 * Retorna o clima carregado, o estado de carregamento, mensagens de erro e
 * uma função para iniciar a busca com base na consulta informada.
 */
export default function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca o clima para a consulta fornecida e atualiza o estado do hook.
   *
   * @param query - Parâmetros de localização com cidade obrigatória e filtros opcionais.
   */
  async function fetchWeather(query: WeatherQuery) {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(query);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err instanceof Error ? err.message : 'Erro inesperado ao buscar o clima.');
    } finally {
      setLoading(false);
    }
  }

  return { weather, loading, error, fetchWeather };
}
